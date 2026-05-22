import math
from typing import Tuple

def calculate_haversine_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers.
    """
    lat1, lon1 = coord1
    lat2, lon2 = coord2

    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r

def is_within_radius(coord1: Tuple[float, float], coord2: Tuple[float, float], radius_km: float = 0.5) -> bool:
    return calculate_haversine_distance(coord1, coord2) <= radius_km
