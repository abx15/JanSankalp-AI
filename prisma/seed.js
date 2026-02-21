const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Data Helpers ─────────────────────────────────────────────────────────────

const COMPLAINT_CATEGORIES = [
    'Road & Potholes', 'Garbage & Sanitation', 'Streetlight',
    'Water Supply', 'Sewage & Drainage', 'Electricity',
    'Traffic & Signals', 'Noise Pollution', 'Park & Recreation',
    'Corruption & Misconduct', 'Building & Construction', 'Public Safety',
];

const STATUSES = ['PENDING', 'RESUMED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const DEPT_NAMES = [
    'Public Works Department', 'Municipal Corporation', 'Water Supply & Sanitation',
    'Electricity Board', 'Traffic Police', 'Healthcare Department',
    'Education Department', 'Urban Development', 'Waste Management', 'Parks & Recreation',
];

const CATEGORY_TO_DEPT = {
    'Road & Potholes': 'Public Works Department',
    'Garbage & Sanitation': 'Waste Management',
    'Streetlight': 'Electricity Board',
    'Water Supply': 'Water Supply & Sanitation',
    'Sewage & Drainage': 'Water Supply & Sanitation',
    'Electricity': 'Electricity Board',
    'Traffic & Signals': 'Traffic Police',
    'Noise Pollution': 'Traffic Police',
    'Park & Recreation': 'Parks & Recreation',
    'Corruption & Misconduct': 'Municipal Corporation',
    'Building & Construction': 'Urban Development',
    'Public Safety': 'Traffic Police',
};

const COMPLAINT_TEMPLATES = [
    { cat: 'Road & Potholes', titles: ['Large pothole on main road', 'Road caved in near market', 'Pothole causing accidents', 'Road surface completely broken', 'Speed breaker damaged'] },
    { cat: 'Garbage & Sanitation', titles: ['Garbage not collected for days', 'Overflowing dustbin', 'Waste dumped on roadside', 'Sanitation workers absent', 'Garbage pile near school'] },
    { cat: 'Streetlight', titles: ['Streetlight not working', 'Multiple lights off in colony', 'Faulty streetlight flickering', 'Dark alley creating safety risk', 'Light pole broken'] },
    { cat: 'Water Supply', titles: ['No water supply for 2 days', 'Contaminated water from tap', 'Low water pressure', 'Water pipeline burst', 'Irregular water schedule'] },
    { cat: 'Sewage & Drainage', titles: ['Drain blocked causing flooding', 'Sewage overflow on street', 'Manhole open and dangerous', 'Stormwater drain choked', 'Foul smell from open drain'] },
    { cat: 'Electricity', titles: ['Power cut for 6+ hours', 'Transformer burnt out', 'Dangling electric wires', 'Illegal connection problem', 'Meter tampering by neighbor'] },
    { cat: 'Traffic & Signals', titles: ['Traffic signal not functioning', 'No signal at busy junction', 'Road divider broken', 'Encroachment causing traffic jam', 'Pedestrian crossing unsafe'] },
    { cat: 'Noise Pollution', titles: ['Construction noise at night', 'Loudspeaker nuisance', 'Commercial generator noise', 'Factory noise violating norms', 'Music event without permission'] },
    { cat: 'Park & Recreation', titles: ['Park swings broken', 'Garden not maintained', 'Encroachment in park', 'Public toilet in poor condition', 'Vandalism in park'] },
    { cat: 'Corruption & Misconduct', titles: ['Bribe demanded for certificate', 'Staff misbehaving with public', 'Fake bill issued', 'Officer absent during duty', 'Work not done despite payment'] },
    { cat: 'Building & Construction', titles: ['Illegal construction nearby', 'Building plan violation', 'Safety hazard at construction site', 'No NOC for demolition', 'Wall collapse risk'] },
    { cat: 'Public Safety', titles: ['Stray dogs attacking people', 'Street harassment at night', 'Suspicious activity reported', 'Broken railing near pond', 'School zone unsafe for children'] },
];

const REASONING_MAP = {
    'Road & Potholes': 'Road damage poses safety risk to commuters and may cause vehicle damage or accidents.',
    'Garbage & Sanitation': 'Waste accumulation is a public health hazard that can lead to disease outbreaks.',
    'Streetlight': 'Non-functional streetlights increase crime risk and road accidents at night.',
    'Water Supply': 'Disrupted water supply affects daily life and hygiene for residents.',
    'Sewage & Drainage': 'Sewage overflow is a serious health hazard and environmental concern.',
    'Electricity': 'Power outages disrupt businesses, home life, and safety systems.',
    'Traffic & Signals': 'Malfunctioning signals create accidents and traffic congestion.',
    'Noise Pollution': 'Noise violation affects health and quality of life for residents.',
    'Park & Recreation': 'Poor maintenance of public spaces reduces quality of civic life.',
    'Corruption & Misconduct': 'Misconduct by civic officials undermines public trust and service delivery.',
    'Building & Construction': 'Unauthorized structures pose safety risks and violate municipal law.',
    'Public Safety': 'Safety hazards require immediate attention to prevent harm to citizens.',
};

// Geographic data (5 states, 3 districts each, 2 cities each, 2 wards each)
const GEO_DATA = [
    {
        name: 'Delhi', districts: [
            {
                name: 'Central Delhi', lat: 28.6139, lon: 77.2090, cities: [
                    { name: 'Connaught Place', wards: ['Ward 1A - CP North', 'Ward 1B - CP South'] },
                    { name: 'Karol Bagh', wards: ['Ward 2A - KB East', 'Ward 2B - KB West'] },
                ]
            },
            {
                name: 'South Delhi', lat: 28.5355, lon: 77.2510, cities: [
                    { name: 'Saket', wards: ['Ward 3A - Saket Main', 'Ward 3B - Saket Extn'] },
                    { name: 'Hauz Khas', wards: ['Ward 4A - HK Village', 'Ward 4B - HK Enclave'] },
                ]
            },
            {
                name: 'East Delhi', lat: 28.6508, lon: 77.3152, cities: [
                    { name: 'Laxmi Nagar', wards: ['Ward 5A - LN Block A', 'Ward 5B - LN Block B'] },
                    { name: 'Preet Vihar', wards: ['Ward 6A - PV Phase 1', 'Ward 6B - PV Phase 2'] },
                ]
            },
        ],
    },
    {
        name: 'Maharashtra', districts: [
            {
                name: 'Mumbai Suburban', lat: 19.0760, lon: 72.8777, cities: [
                    { name: 'Andheri', wards: ['Ward 7A - Andheri East', 'Ward 7B - Andheri West'] },
                    { name: 'Bandra', wards: ['Ward 8A - Bandra East', 'Ward 8B - Bandra West'] },
                ]
            },
            {
                name: 'Pune', lat: 18.5204, lon: 73.8567, cities: [
                    { name: 'Shivajinagar', wards: ['Ward 9A - Shivaji North', 'Ward 9B - Shivaji South'] },
                    { name: 'Kothrud', wards: ['Ward 10A - Kothrud A', 'Ward 10B - Kothrud B'] },
                ]
            },
            {
                name: 'Nagpur', lat: 21.1458, lon: 79.0882, cities: [
                    { name: 'Sitabuldi', wards: ['Ward 11A - Sitabuldi Main', 'Ward 11B - Sitabuldi Extn'] },
                    { name: 'Dharampeth', wards: ['Ward 12A - Dharampeth N', 'Ward 12B - Dharampeth S'] },
                ]
            },
        ],
    },
    {
        name: 'Uttar Pradesh', districts: [
            {
                name: 'Lucknow', lat: 26.8467, lon: 80.9462, cities: [
                    { name: 'Hazratganj', wards: ['Ward 13A - HG North', 'Ward 13B - HG South'] },
                    { name: 'Gomti Nagar', wards: ['Ward 14A - GN Phase 1', 'Ward 14B - GN Phase 2'] },
                ]
            },
            {
                name: 'Agra', lat: 27.1767, lon: 78.0081, cities: [
                    { name: 'Taj Ganj', wards: ['Ward 15A - TG East', 'Ward 15B - TG West'] },
                    { name: 'Sikandra', wards: ['Ward 16A - Sikandra A', 'Ward 16B - Sikandra B'] },
                ]
            },
            {
                name: 'Varanasi', lat: 25.3176, lon: 82.9739, cities: [
                    { name: 'Sigra', wards: ['Ward 17A - Sigra Main', 'Ward 17B - Sigra Colony'] },
                    { name: 'Lanka', wards: ['Ward 18A - Lanka BHU', 'Ward 18B - Lanka Market'] },
                ]
            },
        ],
    },
    {
        name: 'Karnataka', districts: [
            {
                name: 'Bengaluru Urban', lat: 12.9716, lon: 77.5946, cities: [
                    { name: 'Koramangala', wards: ['Ward 19A - Koram Block 1', 'Ward 19B - Koram Block 2'] },
                    { name: 'Whitefield', wards: ['Ward 20A - WF Phase 1', 'Ward 20B - WF Phase 2'] },
                ]
            },
            {
                name: 'Mysuru', lat: 12.2958, lon: 76.6394, cities: [
                    { name: 'Saraswathipuram', wards: ['Ward 21A - Sara North', 'Ward 21B - Sara South'] },
                    { name: 'Kuvempunagar', wards: ['Ward 22A - Kuvempu A', 'Ward 22B - Kuvempu B'] },
                ]
            },
            {
                name: 'Hubli-Dharwad', lat: 15.3647, lon: 75.1240, cities: [
                    { name: 'Vidyanagar', wards: ['Ward 23A - VN East', 'Ward 23B - VN West'] },
                    { name: 'Gokul Road', wards: ['Ward 24A - GR North', 'Ward 24B - GR South'] },
                ]
            },
        ],
    },
    {
        name: 'Rajasthan', districts: [
            {
                name: 'Jaipur', lat: 26.9124, lon: 75.7873, cities: [
                    { name: 'Vaishali Nagar', wards: ['Ward 25A - VN Block A', 'Ward 25B - VN Block B'] },
                    { name: 'Malviya Nagar', wards: ['Ward 26A - MN Phase 1', 'Ward 26B - MN Phase 2'] },
                ]
            },
            {
                name: 'Jodhpur', lat: 26.2389, lon: 73.0243, cities: [
                    { name: 'Ratanada', wards: ['Ward 27A - Ratanada A', 'Ward 27B - Ratanada B'] },
                    { name: 'Shastri Nagar', wards: ['Ward 28A - Shastri E', 'Ward 28B - Shastri W'] },
                ]
            },
            {
                name: 'Udaipur', lat: 24.5854, lon: 73.7125, cities: [
                    { name: 'Hiran Magri', wards: ['Ward 29A - HM Sector 3', 'Ward 29B - HM Sector 4'] },
                    { name: 'Fatehpura', wards: ['Ward 30A - FP Main', 'Ward 30B - FP Colony'] },
                ]
            },
        ],
    },
];

const OFFICER_NAMES = [
    'Rajesh Kumar Sharma', 'Priya Verma', 'Amit Singh', 'Sunita Patel', 'Rohan Gupta',
    'Meena Agarwal', 'Vivek Joshi', 'Anita Chauhan', 'Deepak Yadav', 'Ritu Mishra',
    'Suresh Nair', 'Kavitha Reddy', 'Manoj Tiwari', 'Pooja Desai', 'Arun Pandey',
    'Neha Jain', 'Sanjay Mehta', 'Lalitha Krishnan', 'Rakesh Bhat', 'Smita Kulkarni',
    'Harish Chandra', 'Vandana Singh', 'Bhupesh Sahu', 'Rekha Iyer', 'Prasad Naidu',
    'Divya Rao', 'Mukesh Choudhary', 'Sarla Devi', 'Nitin Kaur', 'Geeta Bajaj',
    'Pawan Kumar', 'Madhuri Saxena', 'Sunil Kapoor', 'Asha Murthy', 'Ajay Rastogi',
    'Usha Tripathi', 'Hemant Dubey', 'Shabana Khan', 'Chirag Shah', 'Leela Menon',
    'Narendra Soni', 'Sarita Bose', 'Manish Awasthi', 'Vidya Hegde', 'Girish Nath',
    'Pushpa Rathore', 'Kamal Prakash', 'Shubha Gaur', 'Inder Mohan', 'Tara Mathur',
    'Vinod Bhatt', 'Jayashree Pillai',
];

const CITIZEN_FIRST_NAMES = [
    'Aarav', 'Aditi', 'Aditya', 'Akash', 'Alok', 'Amit', 'Amita', 'Amitabh', 'Ananya', 'Anil',
    'Anjali', 'Ankit', 'Ankita', 'Anshul', 'Anupam', 'Anuradha', 'Arjun', 'Arpit', 'Asha', 'Ashish',
    'Ashok', 'Astha', 'Avni', 'Ayaan', 'Ayesha', 'Bhavna', 'Chetan', 'Deepa', 'Deepak', 'Devika',
    'Dhruv', 'Divya', 'Gaurav', 'Gauri', 'Geeta', 'Harsha', 'Himani', 'Ishaan', 'Ishita', 'Jatin',
    'Jayant', 'Jyoti', 'Kabir', 'Kajal', 'Karan', 'Kavya', 'Kirti', 'Komal', 'Krishna', 'Kunal',
    'Lalit', 'Leena', 'Mahesh', 'Manish', 'Manju', 'Meera', 'Mihir', 'Mohan', 'Mohit', 'Mukul',
    'Nandini', 'Naresh', 'Naveen', 'Neha', 'Nidhi', 'Nikhil', 'Nikita', 'Nilesh', 'Nisha', 'Nitin',
    'Pankaj', 'Payal', 'Piyush', 'Pooja', 'Pradeep', 'Pranav', 'Priya', 'Priyansh', 'Rahul', 'Raj',
    'Rajesh', 'Rajan', 'Rakesh', 'Ravi', 'Reema', 'Richa', 'Ritesh', 'Rohit', 'Ruchi', 'Sachin',
    'Sahil', 'Samir', 'Sandeep', 'Sanjana', 'Sanjay', 'Sarla', 'Shikha', 'Shiv', 'Shruti', 'Siddharth',
    'Simran', 'Sneha', 'Sonam', 'Subodh', 'Sudhir', 'Sunita', 'Suresh', 'Swati', 'Tanvi', 'Tarun',
    'Uday', 'Ujjwal', 'Vaibhav', 'Vandana', 'Vijay', 'Vikram', 'Vilas', 'Vinay', 'Vishal', 'Vivek',
    'Yash', 'Yogesh', 'Zara', 'Zubin', 'Abhinav', 'Abhishek', 'Aditya', 'Aishwarya', 'Akanksha', 'Alka',
];

const CITIZEN_LAST_NAMES = [
    'Sharma', 'Verma', 'Singh', 'Patel', 'Gupta', 'Agarwal', 'Joshi', 'Chauhan', 'Yadav', 'Mishra',
    'Nair', 'Reddy', 'Tiwari', 'Desai', 'Pandey', 'Jain', 'Mehta', 'Krishnan', 'Bhat', 'Kulkarni',
    'Chandra', 'Rao', 'Choudhary', 'Iyer', 'Naidu', 'Kaur', 'Bajaj', 'Kumar', 'Saxena', 'Kapoor',
    'Murthy', 'Rastogi', 'Tripathi', 'Dubey', 'Khan', 'Shah', 'Menon', 'Soni', 'Bose', 'Awasthi',
    'Hegde', 'Rathore', 'Gaur', 'Mathur', 'Bhatt', 'Pillai', 'Das', 'Ghosh', 'Banerjee', 'Chatterjee',
    'Mukherjee', 'Roy', 'Dutta', 'Bose', 'Sen', 'Saha', 'Biswas', 'Mondal', 'Paul', 'Ghosal',
    'Srivastava', 'Dixit', 'Khatri', 'Tandon', 'Malhotra', 'Khanna', 'Sethi', 'Chopra', 'Anand', 'Bedi',
    'Thakur', 'Rawat', 'Bisht', 'Negi', 'Bhatt', 'Bhardwaj', 'Rajput', 'Solanki', 'Parmar', 'Chawla',
    'Garg', 'Bansal', 'Mittal', 'Singhal', 'Agrawal', 'Goyal', 'Gupta', 'Jindal', 'Oswal', 'Khandelwal',
    'Patil', 'Shinde', 'Jadhav', 'More', 'Pawar', 'Gaikwad', 'Salunkhe', 'Mane', 'Kadam', 'Ware',
];

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(arr, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < arr.length; i++) {
        r -= weights[i];
        if (r <= 0) return arr[i];
    }
    return arr[arr.length - 1];
}

function generateTicketId(index) {
    return `JSK-2026-${String(index).padStart(6, '0')}`;
}

function randomDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - rand(0, daysAgo));
    d.setHours(rand(6, 22), rand(0, 59), rand(0, 59));
    return d;
}

function generateDescription(title, category) {
    const details = [
        `This has been the situation for ${rand(1, 14)} days now. Multiple residents have reported this.`,
        `Despite several verbal complaints to local authorities, no action has been taken.`,
        `This is causing serious inconvenience to the public, especially elderly and children.`,
        `The situation has been photographed and documented by our resident welfare association.`,
        `Urgent action is requested as this poses a direct safety hazard.`,
        `This issue was also reported last month but the repair was shoddy and it has recurred.`,
    ];
    return `${title}. ${pick(details)} Category: ${category}. Location verified by GPS.`;
}

// ─── Main Seed Function ────────────────────────────────────────────────────────

async function main() {
    console.log('🌱 Starting comprehensive DB seed...\n');

    // ─── 1. Hash password ───────────────────────────────────────────────────────
    console.log('🔒 Hashing passwords...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const officerPassword = await bcrypt.hash('officer123', 10);

    // ─── 2. Geographic Hierarchy ────────────────────────────────────────────────
    console.log('🗺️  Seeding geographic hierarchy (States → Districts → Cities → Wards)...');

    const stateMap = {};
    const districtMap = {};
    const cityMap = {};
    const wardList = [];

    for (const stateData of GEO_DATA) {
        const state = await prisma.state.upsert({
            where: { name: stateData.name },
            update: {},
            create: { name: stateData.name },
        });
        stateMap[stateData.name] = state;

        for (const distData of stateData.districts) {
            const district = await prisma.district.upsert({
                where: { name_stateId: { name: distData.name, stateId: state.id } },
                update: {},
                create: { name: distData.name, stateId: state.id },
            });
            districtMap[distData.name] = { ...district, lat: distData.lat, lon: distData.lon, stateId: state.id };

            for (const cityData of distData.cities) {
                const city = await prisma.city.upsert({
                    where: { name_districtId: { name: cityData.name, districtId: district.id } },
                    update: {},
                    create: { name: cityData.name, districtId: district.id },
                });
                cityMap[cityData.name] = { ...city, districtId: district.id, stateId: state.id, lat: distData.lat, lon: distData.lon };

                for (const wardName of cityData.wards) {
                    const ward = await prisma.ward.upsert({
                        where: { name_cityId: { name: wardName, cityId: city.id } },
                        update: {},
                        create: { name: wardName, cityId: city.id },
                    });
                    wardList.push({ ...ward, cityId: city.id, districtId: district.id, stateId: state.id, lat: distData.lat, lon: distData.lon });
                }
            }
        }
    }

    console.log(`   ✅ ${Object.keys(stateMap).length} states, ${Object.keys(districtMap).length} districts, ${Object.keys(cityMap).length} cities, ${wardList.length} wards`);

    // ─── 3. Departments ─────────────────────────────────────────────────────────
    console.log('🏢 Seeding departments...');
    const deptMap = {};
    for (const deptName of DEPT_NAMES) {
        const dept = await prisma.department.upsert({
            where: { name: deptName },
            update: {},
            create: { name: deptName },
        });
        deptMap[deptName] = dept;
    }
    const deptList = Object.values(deptMap);
    console.log(`   ✅ ${deptList.length} departments`);

    // ─── 4. ADMIN Users ─────────────────────────────────────────────────────────
    console.log('👑 Seeding admin users...');
    const admin1 = await prisma.user.upsert({
        where: { email: 'admin@jansankalp.ai' },
        update: {},
        create: {
            email: 'admin@jansankalp.ai',
            name: 'Super Admin',
            password: adminPassword,
            role: 'ADMIN',
            emailVerified: new Date(),
            points: 9999,
        },
    });

    const admin2 = await prisma.user.upsert({
        where: { email: 'superadmin@jansankalp.gov.in' },
        update: {},
        create: {
            email: 'superadmin@jansankalp.gov.in',
            name: 'National Admin',
            password: adminPassword,
            role: 'ADMIN',
            emailVerified: new Date(),
            points: 9999,
        },
    });

    // ─── 5. OFFICER Users ──────────────────────────────────────────────────────
    console.log('👮 Seeding 52 officer users...');
    const officers = [];
    const wardKeys = wardList;

    for (let i = 0; i < OFFICER_NAMES.length; i++) {
        const name = OFFICER_NAMES[i];
        const wardObj = wardKeys[i % wardKeys.length];
        const email = `officer${i + 1}@jansankalp.gov.in`;

        const officer = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name,
                password: officerPassword,
                role: 'OFFICER',
                emailVerified: new Date(),
                points: rand(50, 500),
                stateId: wardObj.stateId,
                districtId: wardObj.districtId,
                cityId: wardObj.cityId,
                wardId: wardObj.id,
            },
        });
        officers.push(officer);
    }

    // Assign officers as department heads (first 10 officers → 10 depts)
    for (let i = 0; i < Math.min(officers.length, deptList.length); i++) {
        await prisma.department.update({
            where: { id: deptList[i].id },
            data: { headId: officers[i].id },
        });
    }
    console.log(`   ✅ ${officers.length} officers seeded`);

    // ─── 6. CITIZEN Users (1000) ────────────────────────────────────────────────
    console.log('👥 Seeding 1000 citizen users...');
    const citizens = [];
    const citizenBatch = [];

    for (let i = 0; i < 1000; i++) {
        const firstName = pick(CITIZEN_FIRST_NAMES);
        const lastName = pick(CITIZEN_LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        const email = `citizen${i + 1}@example.com`;
        const wardObj = wardList[i % wardList.length];

        citizenBatch.push({
            email,
            name,
            password: hashedPassword,
            role: 'CITIZEN',
            emailVerified: new Date(),
            points: rand(0, 300),
            stateId: wardObj.stateId,
            districtId: wardObj.districtId,
            cityId: wardObj.cityId,
            wardId: wardObj.id,
            phone: `+91${rand(7000000000, 9999999999)}`,
        });
    }

    // Use createMany with skipDuplicates for performance
    await prisma.user.createMany({ data: citizenBatch, skipDuplicates: true });

    // Fetch all citizens for use in complaints
    const citizenRows = await prisma.user.findMany({
        where: { role: 'CITIZEN' },
        select: { id: true, stateId: true, districtId: true, cityId: true, wardId: true },
    });
    console.log(`   ✅ ${citizenRows.length} citizen users seeded`);

    // ─── 7. Complaints (1300+) ──────────────────────────────────────────────────
    console.log('📋 Seeding 1310 complaints with AI analysis...');

    // Status weights: PENDING(30%), IN_PROGRESS(25%), RESOLVED(30%), REJECTED(8%), RESUMED(7%)
    const statusWeights = [30, 7, 25, 30, 8];

    const complaintBatch = [];
    let ticketIndex = 1;

    for (let i = 0; i < 1310; i++) {
        const template = pick(COMPLAINT_TEMPLATES);
        const cat = template.cat;
        const title = pick(template.titles);
        const status = pickWeighted(STATUSES, statusWeights);
        const severity = rand(1, 5);
        const confidence = parseFloat((0.65 + Math.random() * 0.35).toFixed(2));
        const citizenRow = citizenRows[i % citizenRows.length];
        const wardObj = wardList[i % wardList.length];
        const dept = deptMap[CATEGORY_TO_DEPT[cat]];
        const daysAgo = rand(0, 180);
        const createdAt = randomDate(daysAgo);

        const assignedOfficer = status !== 'PENDING' ? officers[i % officers.length] : null;

        complaintBatch.push({
            ticketId: generateTicketId(ticketIndex++),
            title,
            description: generateDescription(title, cat),
            status,
            severity,
            category: cat,
            confidenceScore: confidence,
            latitude: wardObj.lat + (Math.random() - 0.5) * 0.05,
            longitude: wardObj.lon + (Math.random() - 0.5) * 0.05,
            authorId: citizenRow.id,
            assignedToId: assignedOfficer?.id || null,
            departmentId: dept?.id || null,
            stateId: wardObj.stateId,
            districtId: wardObj.districtId,
            cityId: wardObj.cityId,
            wardId: wardObj.id,
            isDuplicate: Math.random() < 0.05,
            spamScore: parseFloat((Math.random() * 0.15).toFixed(3)),
            resolutionVerified: status === 'RESOLVED' ? Math.random() > 0.3 : null,
            aiAnalysis: {
                category: cat,
                confidence,
                severity,
                reasoning: REASONING_MAP[cat],
                processedAt: createdAt.toISOString(),
                modelVersion: 'jansankalp-v2.1',
                flags: severity >= 4 ? ['urgent', 'high-risk'] : severity >= 3 ? ['moderate'] : ['routine'],
            },
            createdAt,
            updatedAt: new Date(),
        });
    }

    // Insert in batches of 100
    for (let i = 0; i < complaintBatch.length; i += 100) {
        await prisma.complaint.createMany({
            data: complaintBatch.slice(i, i + 100),
            skipDuplicates: true,
        });
    }
    console.log(`   ✅ 1310 complaints seeded`);

    // ─── 8. Remarks (on resolved/in-progress complaints) ────────────────────────
    console.log('💬 Seeding remarks on complaints...');
    const resolvedComplaints = await prisma.complaint.findMany({
        where: { status: { in: ['RESOLVED', 'IN_PROGRESS'] } },
        select: { id: true },
        take: 400,
    });

    const remarkBatch = [];
    const officerRemarks = [
        'Issue has been inspected and repair team dispatched.',
        'Work order issued to contractor. Estimated completion: 3 days.',
        'On-site visit completed. Materials ordered.',
        'Repair completed. Please verify and close if satisfactory.',
        'Escalated to senior department for resource allocation.',
        'Temporary fix applied. Permanent repair scheduled next week.',
    ];
    const citizenRemarks = [
        'Still not fixed. Please expedite.',
        'Thank you for the quick resolution!',
        'The issue is partially resolved.',
        'Great work by the team!',
        'No update received despite follow up.',
    ];

    for (const complaint of resolvedComplaints) {
        const officerRemark = pick(officers);
        const remarkCount = rand(1, 3);
        for (let r = 0; r < remarkCount; r++) {
            remarkBatch.push({
                text: r === 0 ? pick(officerRemarks) : pick(citizenRemarks),
                authorName: r === 0 ? (officerRemark.name || 'Officer') : pick(CITIZEN_FIRST_NAMES),
                authorRole: r === 0 ? 'OFFICER' : 'CITIZEN',
                complaintId: complaint.id,
            });
        }
    }
    await prisma.remark.createMany({ data: remarkBatch, skipDuplicates: false });
    console.log(`   ✅ ${remarkBatch.length} remarks seeded`);

    // ─── 9. Notifications ───────────────────────────────────────────────────────
    console.log('🔔 Seeding notifications...');
    const allComplaints = await prisma.complaint.findMany({
        select: { id: true, authorId: true, status: true, ticketId: true, title: true },
        take: 600,
    });

    const notifBatch = [];
    for (const c of allComplaints) {
        notifBatch.push({
            userId: c.authorId,
            type: 'COMPLAINT_REGISTERED',
            title: 'Complaint Registered',
            message: `Your complaint "${c.title.substring(0, 50)}" (${c.ticketId}) has been registered.`,
            complaintId: c.id,
            read: Math.random() > 0.5,
        });
        if (c.status === 'IN_PROGRESS') {
            notifBatch.push({
                userId: c.authorId,
                type: 'STATUS_UPDATE',
                title: 'Work In Progress',
                message: `Repair team has been assigned to your complaint ${c.ticketId}.`,
                complaintId: c.id,
                read: Math.random() > 0.4,
            });
        }
        if (c.status === 'RESOLVED') {
            notifBatch.push({
                userId: c.authorId,
                type: 'RESOLVED',
                title: 'Issue Resolved ✓',
                message: `Your complaint ${c.ticketId} has been successfully resolved. Please rate your experience.`,
                complaintId: c.id,
                read: Math.random() > 0.3,
            });
        }
    }

    for (let i = 0; i < notifBatch.length; i += 200) {
        await prisma.notification.createMany({ data: notifBatch.slice(i, i + 200), skipDuplicates: false });
    }
    console.log(`   ✅ ${notifBatch.length} notifications seeded`);

    // ─── 10. Audit Logs ─────────────────────────────────────────────────────────
    console.log('📜 Seeding audit logs...');
    const auditActions = [
        'USER_LOGIN', 'USER_REGISTERED', 'COMPLAINT_CREATED', 'STATUS_UPDATED',
        'OFFICER_ASSIGNED', 'COMPLAINT_RESOLVED', 'COMPLAINT_REJECTED', 'REPORT_GENERATED',
        'BUDGET_UPDATED', 'DEPARTMENT_MODIFIED',
    ];
    const auditBatch = [];
    for (let i = 0; i < 500; i++) {
        const action = pick(auditActions);
        const actor = Math.random() > 0.5 ? admin1.id : officers[i % officers.length].id;
        auditBatch.push({
            action,
            userId: actor,
            details: `${action} performed at ${new Date().toISOString()}. Record #${i + 1}.`,
            createdAt: randomDate(90),
        });
    }
    await prisma.auditLog.createMany({ data: auditBatch });
    console.log(`   ✅ 500 audit log entries seeded`);

    // ─── 11. Budget Forecasts ───────────────────────────────────────────────────
    console.log('💰 Seeding budget forecasts...');
    const periods = ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1'];
    const budgetForecasts = [];

    for (const period of periods) {
        for (const dept of deptList.slice(0, 5)) {
            for (const state of Object.values(stateMap).slice(0, 3)) {
                const predicted = rand(500000, 5000000);
                budgetForecasts.push({
                    period,
                    periodType: 'QUARTERLY',
                    departmentId: dept.id,
                    stateId: state.id,
                    predictedAmount: predicted,
                    actualAmount: period.startsWith('2025') ? predicted * (0.8 + Math.random() * 0.4) : null,
                    confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
                    modelVersion: 'budget-forecast-v1.0',
                    personnelCost: predicted * 0.35,
                    infrastructureCost: predicted * 0.40,
                    operationalCost: predicted * 0.20,
                    emergencyFund: predicted * 0.05,
                    status: 'ACTIVE',
                    createdBy: admin1.id,
                    insights: {
                        trend: 'increasing',
                        riskLevel: pick(['LOW', 'MEDIUM', 'HIGH']),
                        notes: `Budget forecast for ${dept.name} in ${state.name} for ${period}.`,
                    },
                    riskFactors: {
                        seasonal: Math.random() > 0.5,
                        infrastructure_age: rand(1, 10),
                        complaint_volume: rand(50, 500),
                    },
                    recommendations: {
                        priority: pick(['HIGH', 'MEDIUM', 'LOW']),
                        action: 'Review contractor performance and optimize material procurement.',
                    },
                });
            }
        }
    }

    // Filter for unique constraint [period, periodType, departmentId, stateId, districtId]
    await prisma.budgetForecast.createMany({ data: budgetForecasts, skipDuplicates: true });
    console.log(`   ✅ ${budgetForecasts.length} budget forecasts seeded`);

    // ─── 12. Budget Actuals ──────────────────────────────────────────────────────
    console.log('📊 Seeding budget actuals...');
    const budgetActuals = [];
    for (const period of ['2025-Q1', '2025-Q2', '2025-Q3']) {
        for (const dept of deptList.slice(0, 5)) {
            for (const state of Object.values(stateMap).slice(0, 3)) {
                const total = rand(400000, 4500000);
                budgetActuals.push({
                    period,
                    periodType: 'QUARTERLY',
                    departmentId: dept.id,
                    stateId: state.id,
                    totalAmount: total,
                    personnelCost: total * 0.35,
                    infrastructureCost: total * 0.40,
                    operationalCost: total * 0.20,
                    emergencySpent: total * 0.05,
                    complaintCount: rand(100, 600),
                    resolvedCount: rand(60, 400),
                    emergencyEvents: rand(0, 15),
                    verifiedBy: admin1.id,
                    notes: `Actual expenditure for ${dept.name}, ${state.name}, ${period}.`,
                });
            }
        }
    }
    await prisma.budgetActual.createMany({ data: budgetActuals, skipDuplicates: false });
    console.log(`   ✅ ${budgetActuals.length} budget actuals seeded`);

    // ─── 13. Cost Optimizations ──────────────────────────────────────────────────
    console.log('⚡ Seeding cost optimizations...');
    const costOpts = [
        { title: 'Centralized Contractor Procurement', desc: 'Consolidate contractor bids across departments to reduce procurement costs by 15-20%.', cat: 'PROCUREMENT' },
        { title: 'Predictive Maintenance Scheduling', desc: 'Use AI to predict infrastructure failures and schedule proactive maintenance.', cat: 'INFRASTRUCTURE' },
        { title: 'Digital Complaint Processing', desc: 'Eliminate paper-based complaint processing to reduce operational overhead.', cat: 'OPERATIONAL' },
        { title: 'Shared Mobile Patrol Units', desc: 'Pool field inspection teams across PWD and Municipal for efficiency.', cat: 'PERSONNEL' },
        { title: 'Solar-Powered Streetlights', desc: 'Replace conventional streetlights with solar units to cut electricity costs.', cat: 'INFRASTRUCTURE' },
        { title: 'Automated Meter Reading', desc: 'Deploy IoT meters for water/electricity to reduce manual reading costs.', cat: 'OPERATIONAL' },
        { title: 'Bulk Material Procurement', desc: 'Purchase road repair materials in bulk for all districts to get volume discounts.', cat: 'PROCUREMENT' },
        { title: 'Cross-Training Field Staff', desc: 'Train PWD staff to handle basic sanitation tasks to reduce redundant deployments.', cat: 'PERSONNEL' },
    ];

    const costOptBatch = [];
    for (const opt of costOpts) {
        const savings = rand(200000, 2000000);
        costOptBatch.push({
            title: opt.title,
            description: opt.desc,
            category: opt.cat,
            priority: pick(['HIGH', 'MEDIUM', 'LOW']),
            potentialSavings: savings,
            implementationCost: savings * (0.1 + Math.random() * 0.3),
            roi: parseFloat((1.5 + Math.random() * 3).toFixed(2)),
            timeframe: pick(['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM']),
            departmentId: pick(deptList).id,
            stateId: pick(Object.values(stateMap)).id,
            status: pick(['PROPOSED', 'APPROVED', 'IMPLEMENTED', 'PROPOSED', 'PROPOSED']),
            aiConfidence: parseFloat((0.72 + Math.random() * 0.25).toFixed(2)),
            aiReasoning: { basis: 'Historical expenditure analysis + complaint volume trend', dataPoints: rand(100, 500) },
        });
    }
    await prisma.costOptimization.createMany({ data: costOptBatch, skipDuplicates: false });
    console.log(`   ✅ ${costOptBatch.length} cost optimizations seeded`);

    // ─── 14. Demand Surges ──────────────────────────────────────────────────────
    console.log('📈 Seeding demand surges...');
    const surges = [
        { title: 'Post-Monsoon Road Damage Surge', desc: 'Heavy rains causing widespread road potholes across Delhi and UP.', severity: 'HIGH' },
        { title: 'Summer Water Shortage Crisis', desc: 'Increased demand and reduced groundwater forcing water supply restrictions.', severity: 'CRITICAL' },
        { title: 'Festival Noise Complaints Surge', desc: 'High volume of noise pollution complaints during festival season.', severity: 'MEDIUM' },
        { title: 'Winter Fog — Street Light Demand', desc: 'Dense fog conditions creating urgent demand for functional streetlights.', severity: 'HIGH' },
        { title: 'Garbage Strike Impact', desc: 'Worker strike causing rapid garbage accumulation across multiple districts.', severity: 'CRITICAL' },
        { title: 'Seasonal Drainage Overload', desc: 'Pre-monsoon choking of storm drains requiring urgent preventive work.', severity: 'MEDIUM' },
    ];

    const surgeBatch = [];
    for (const surge of surges) {
        const start = randomDate(30);
        const end = new Date(start);
        end.setDate(end.getDate() + rand(7, 60));
        surgeBatch.push({
            title: surge.title,
            description: surge.desc,
            severity: surge.severity,
            predictedStart: start,
            predictedEnd: end,
            confidence: parseFloat((0.70 + Math.random() * 0.28).toFixed(2)),
            departmentId: pick(deptList).id,
            stateId: pick(Object.values(stateMap)).id,
            estimatedComplaints: rand(200, 2000),
            estimatedCost: rand(100000, 1000000),
            affectedAreas: { districts: rand(2, 8), cities: rand(4, 20) },
            factors: { seasonal: true, historical_avg: rand(300, 800), ai_prediction_basis: 'seasonal pattern + weather data' },
            status: pick(['PREDICTED', 'ACTIVE', 'RESOLVED', 'PREDICTED', 'ACTIVE']),
            modelVersion: 'surge-predictor-v1.2',
            aiInsights: {
                confidence: surge.severity === 'CRITICAL' ? 0.92 : 0.78,
                recommendation: `Pre-position ${surge.severity === 'CRITICAL' ? 'emergency' : 'additional'} response teams in affected areas.`,
            },
        });
    }
    await prisma.demandSurge.createMany({ data: surgeBatch, skipDuplicates: false });
    console.log(`   ✅ ${surgeBatch.length} demand surges seeded`);

    // ─── Summary ────────────────────────────────────────────────────────────────
    const [totalUsers, totalComplaints, totalNotifs, totalRemarks] = await Promise.all([
        prisma.user.count(),
        prisma.complaint.count(),
        prisma.notification.count(),
        prisma.remark.count(),
    ]);

    console.log('\n✨ ═══════════════════════════════════════════');
    console.log('   SEED COMPLETE — Database Summary:');
    console.log('═════════════════════════════════════════════');
    console.log(`   👑 Admin users     : 2`);
    console.log(`   👮 Officers        : ${officers.length}`);
    console.log(`   👥 Citizens        : ${citizenRows.length}`);
    console.log(`   📊 Total Users     : ${totalUsers}`);
    console.log(`   📋 Complaints      : ${totalComplaints}`);
    console.log(`   💬 Remarks         : ${totalRemarks}`);
    console.log(`   🔔 Notifications   : ${totalNotifs}`);
    console.log(`   🏢 Departments     : ${deptList.length}`);
    console.log(`   🗺️  States          : ${Object.keys(stateMap).length}`);
    console.log(`   🏙️  Districts       : ${Object.keys(districtMap).length}`);
    console.log(`   🏘️  Cities          : ${Object.keys(cityMap).length}`);
    console.log(`   🏠 Wards           : ${wardList.length}`);
    console.log(`   💰 Budget Forecasts: ${budgetForecasts.length}`);
    console.log(`   📈 Demand Surges   : ${surgeBatch.length}`);
    console.log('═════════════════════════════════════════════');
    console.log('\n🔑 Login credentials:');
    console.log('   Admin    → admin@jansankalp.ai / admin123');
    console.log('   Officers → officer1@jansankalp.gov.in / officer123');
    console.log('   Citizens → citizen1@example.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
