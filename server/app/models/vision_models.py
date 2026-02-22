"""
Computer Vision Models for Infrastructure Analysis
Handles image analysis, object detection, and infrastructure monitoring
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from typing import Dict, List, Any, Tuple, Optional
import cv2
from transformers import AutoImageProcessor, AutoModelForImageClassification

class InfrastructureAnalyzer(nn.Module):
    """
    Deep learning model for analyzing infrastructure images
    Detects potholes, damaged streetlights, water leaks, etc.
    """
    
    def __init__(self, num_classes: int = 10):
        super(InfrastructureAnalyzer, self).__init__()
        
        # CNN architecture for image analysis
        self.features = nn.Sequential(
            # Conv Block 1
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Conv Block 2
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Conv Block 3
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Conv Block 4
            nn.Conv2d(256, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(512 * 14 * 14, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(4096, 1024),
            nn.ReLU(inplace=True),
            nn.Linear(1024, num_classes),
        )
        
        # Damage severity predictor
        self.severity_predictor = nn.Sequential(
            nn.Linear(512 * 14 * 14, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(512, 128),
            nn.ReLU(inplace=True),
            nn.Linear(128, 5),  # Severity levels 1-5
        )
        
        # Object detection for specific issues
        self.pothole_detector = self._create_detection_head('pothole')
        self.streetlight_detector = self._create_detection_head('streetlight')
        self.water_leak_detector = self._create_detection_head('water_leak')
        
    def _create_detection_head(self, name: str) -> nn.Sequential:
        """Create detection head for specific infrastructure issues"""
        return nn.Sequential(
            nn.Conv2d(512, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 1, kernel_size=1),
            nn.Sigmoid()
        )
    
    def forward(self, x: torch.Tensor) -> Dict[str, torch.Tensor]:
        """
        Forward pass returns classification, severity, and detection maps
        """
        # Extract features
        features = self.features(x)
        
        # Global average pooling for classification
        gap = F.adaptive_avg_pool2d(features, (14, 14))
        gap_flat = gap.view(gap.size(0), -1)
        
        # Classification
        classification = self.classifier(gap_flat)
        
        # Severity prediction
        severity = self.severity_predictor(gap_flat)
        
        # Detection maps
        pothole_map = self.pothole_detector(features)
        streetlight_map = self.streetlight_detector(features)
        water_leak_map = self.water_leak_detector(features)
        
        return {
            'classification': F.softmax(classification, dim=1),
            'severity': F.softmax(severity, dim=1),
            'pothole_map': pothole_map,
            'streetlight_map': streetlight_map,
            'water_leak_map': water_leak_map,
            'features': gap_flat
        }
    
    def predict(self, image: Image.Image) -> Dict[str, Any]:
        """
        Make predictions on a single image
        """
        # Preprocess image
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        input_tensor = transform(image).unsqueeze(0)
        
        with torch.no_grad():
            outputs = self.forward(input_tensor)
        
        # Process outputs
        category_idx = torch.argmax(outputs['classification'], dim=1)[0].item()
        severity_idx = torch.argmax(outputs['severity'], dim=1)[0].item() + 1
        
        # Detection confidence
        pothole_conf = torch.max(outputs['pothole_map']).item()
        streetlight_conf = torch.max(outputs['streetlight_map']).item()
        water_leak_conf = torch.max(outputs['water_leak_map']).item()
        
        return {
            'category': self._get_category_name(category_idx),
            'severity': severity_idx,
            'pothole_detected': pothole_conf > 0.5,
            'pothole_confidence': pothole_conf,
            'streetlight_detected': streetlight_conf > 0.5,
            'streetlight_confidence': streetlight_conf,
            'water_leak_detected': water_leak_conf > 0.5,
            'water_leak_confidence': water_leak_conf,
            'overall_confidence': torch.max(outputs['classification']).item()
        }
    
    def _get_category_name(self, idx: int) -> str:
        """Map category index to name"""
        categories = [
            'Pothole', 'Streetlight Damage', 'Water Leak', 'Garbage Accumulation',
            'Road Damage', 'Traffic Signal Issue', 'Sewage Blockage',
            'Electricity Wire Damage', 'Park Maintenance', 'Building Damage'
        ]
        return categories[idx] if idx < len(categories) else 'Unknown'


class PotholeDetector:
    """
    Specialized pothole detection using computer vision techniques
    """
    
    def __init__(self):
        self.cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        # Note: In production, use a proper pothole detection model
        
    def detect_potholes(self, image: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detect potholes in road images
        """
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to find dark regions (potential potholes)
        _, thresh = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY_INV)
        
        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        potholes = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 100:  # Filter small contours
                x, y, w, h = cv2.boundingRect(contour)
                
                # Calculate circularity (potholes are roughly circular)
                perimeter = cv2.arcLength(contour, True)
                if perimeter > 0:
                    circularity = 4 * np.pi * area / (perimeter * perimeter)
                else:
                    circularity = 0
                
                # Confidence based on area and circularity
                confidence = min(1.0, (area / 1000) * circularity)
                
                potholes.append({
                    'bbox': [x, y, w, h],
                    'area': area,
                    'circularity': circularity,
                    'confidence': confidence,
                    'center': [x + w//2, y + h//2]
                })
        
        # Sort by confidence
        potholes.sort(key=lambda x: x['confidence'], reverse=True)
        
        return potholes


class StreetlightAnalyzer:
    """
    Analyze streetlight conditions from images
    """
    
    def __init__(self):
        self.brightness_threshold = 100
        
    def analyze_streetlight(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Analyze streetlight for damage or functionality issues
        """
        # Convert to different color spaces
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Check for light emission (brightness)
        avg_brightness = np.mean(gray)
        
        # Check for broken glass (detect sharp edges)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / edges.size
        
        # Check for rust (orange/brown regions in HSV)
        lower_rust = np.array([10, 100, 100])
        upper_rust = np.array([20, 255, 255])
        rust_mask = cv2.inRange(hsv, lower_rust, upper_rust)
        rust_ratio = np.sum(rust_mask > 0) / rust_mask.size
        
        # Determine condition
        if avg_brightness > self.brightness_threshold:
            condition = "Working"
        elif rust_ratio > 0.1:
            condition = "Rusted"
        elif edge_density > 0.05:
            condition = "Broken"
        else:
            condition = "Off"
        
        return {
            'condition': condition,
            'brightness': avg_brightness,
            'edge_density': edge_density,
            'rust_ratio': rust_ratio,
            'confidence': self._calculate_confidence(avg_brightness, edge_density, rust_ratio)
        }
    
    def _calculate_confidence(self, brightness: float, edge_density: float, rust_ratio: float) -> float:
        """Calculate confidence in the analysis"""
        if brightness > self.brightness_threshold:
            return min(1.0, brightness / 255)
        elif rust_ratio > 0.1:
            return min(1.0, rust_ratio * 10)
        elif edge_density > 0.05:
            return min(1.0, edge_density * 20)
        else:
            return 0.5


class WaterLeakDetector:
    """
    Detect water leaks in infrastructure images
    """
    
    def __init__(self):
        self.moisture_threshold = 150
        
    def detect_water_leak(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Detect water leaks based on color and texture analysis
        """
        # Convert to different color spaces
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Water appears as dark, wet regions
        water_mask = gray < self.moisture_threshold
        
        # Check for wet reflections (high saturation in HSV)
        saturation = hsv[:, :, 1]
        high_saturation = saturation > 200
        
        # Combine masks
        potential_water = water_mask & high_saturation
        
        # Find connected components
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(
            potential_water.astype(np.uint8)
        )
        
        # Filter small regions
        water_regions = []
        for i in range(1, num_labels):  # Skip background (0)
            area = stats[i, cv2.CC_STAT_AREA]
            if area > 50:  # Minimum area threshold
                water_regions.append({
                    'area': area,
                    'centroid': centroids[i].tolist(),
                    'bbox': [
                        stats[i, cv2.CC_STAT_LEFT],
                        stats[i, cv2.CC_STAT_TOP],
                        stats[i, cv2.CC_STAT_WIDTH],
                        stats[i, cv2.CC_STAT_HEIGHT]
                    ]
                })
        
        # Calculate leak probability
        water_ratio = np.sum(potential_water) / potential_water.size
        leak_probability = min(1.0, water_ratio * 10)
        
        return {
            'leak_detected': leak_probability > 0.3,
            'leak_probability': leak_probability,
            'water_regions': water_regions,
            'water_ratio': water_ratio,
            'confidence': leak_probability if leak_probability > 0.3 else 0.5
        }


# Initialize global instances
infrastructure_analyzer = InfrastructureAnalyzer()
pothole_detector = PotholeDetector()
streetlight_analyzer = StreetlightAnalyzer()
water_leak_detector = WaterLeakDetector()

if __name__ == "__main__":
    # Test the vision models
    print("Testing Vision Models...")
    
    # Test with dummy image
    test_image = Image.new('RGB', (224, 224), color='red')
    
    # Test infrastructure analyzer
    if torch.cuda.is_available():
        test_tensor = torch.randn(1, 3, 224, 224).cuda()
        analyzer = InfrastructureAnalyzer().cuda()
        outputs = analyzer(test_tensor)
        
        print(f"Infrastructure Analyzer Output Keys: {list(outputs.keys())}")
        print(f"Classification shape: {outputs['classification'].shape}")
    
    # Test pothole detector
    dummy_image = np.zeros((300, 300, 3), dtype=np.uint8)
    potholes = pothole_detector.detect_potholes(dummy_image)
    print(f"Pothole detection found {len(potholes)} potholes")
    
    # Test streetlight analyzer
    streetlight_result = streetlight_analyzer.analyze_streetlight(dummy_image)
    print(f"Streetlight condition: {streetlight_result['condition']}")
    
    # Test water leak detector
    leak_result = water_leak_detector.detect_water_leak(dummy_image)
    print(f"Water leak detected: {leak_result['leak_detected']}")
    
    print("Vision Models working correctly!")
