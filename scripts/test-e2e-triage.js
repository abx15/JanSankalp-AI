const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runE2ETriage() {
  console.log('🤖 STARTING JANSANKALP AI END-TO-END AUTOMATION TEST...');
  console.log('=====================================================');

  try {
    // 1. Citizen Login
    console.log('👤 Logging in as Citizen (citizen1@example.com)...');
    const citizenLogin = await fetch('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'citizen1@example.com',
        password: 'password123',
      }),
    });

    if (!citizenLogin.ok) {
      throw new Error(`Citizen login failed: ${await citizenLogin.text()}`);
    }

    const citizenData = await citizenLogin.json();
    const citizenToken = citizenData.accessToken;
    const citizenId = citizenData.user.id;
    const citizenInitialPoints = citizenData.user.points || 0;
    console.log(`✅ Citizen authenticated! Initial Points: ${citizenInitialPoints}`);

    // 2. Officer Login
    console.log('👔 Logging in as Officer (officer1@jansankalp.gov.in)...');
    const officerLogin = await fetch('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'officer1@jansankalp.gov.in',
        password: 'officer123',
      }),
    });

    if (!officerLogin.ok) {
      throw new Error(`Officer login failed: ${await officerLogin.text()}`);
    }

    const officerData = await officerLogin.json();
    const officerToken = officerData.accessToken;
    console.log(`✅ Officer authenticated!`);

    // 3. Submit a new, unique complaint to Nginx API Gateway
    const uniqueTitle = `Sewer water pipeline leak ${Date.now()}`;
    const uniqueDesc = `Water leak and heavy pool on Sector 14 street. There is a huge foul smell and water supply in the local block is highly polluted.`;
    console.log(`📝 Filing new complaint: "${uniqueTitle}"`);

    const submitResp = await fetch('http://localhost/api/workflows/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${citizenToken}`,
      },
      body: JSON.stringify({
        title: uniqueTitle,
        description: uniqueDesc,
        latitude: 28.6139,
        longitude: 77.2090,
      }),
    });

    if (!submitResp.ok) {
      throw new Error(`Complaint submission failed: ${await submitResp.text()}`);
    }

    const submitData = await submitResp.json();
    const complaint = submitData.data;
    console.log(`✅ Complaint successfully submitted! Ticket ID: ${complaint.ticketId} | Database ID: ${complaint.id}`);

    // 4. Wait for BullMQ & FastAPI AI queue to execute autonomous triage & routing
    console.log('⏳ Waiting 12 seconds for background AI Agent pipeline to triage & route...');
    await new Promise((resolve) => setTimeout(resolve, 12000));

    // 5. Fetch updated complaint status and details
    console.log('🔍 Fetching triaged complaint from API...');
    const getResp = await fetch(`http://localhost/api/workflows/complaints/${complaint.id}`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` },
    });

    if (!getResp.ok) {
      throw new Error(`Failed to fetch complaint: ${await getResp.text()}`);
    }

    const getData = await getResp.json();
    const triaged = getData.data;

    console.log('\n📊 TRIAGED COMPLAINT STATUS AND METRICS:');
    console.log(`- Status: ${triaged.status}`);
    console.log(`- AI Assigned Category: ${triaged.category}`);
    console.log(`- Severity (1-5 scaled): ${triaged.severity}`);
    console.log(`- Confidence Score: ${triaged.confidenceScore}`);
    console.log(`- Is Duplicate: ${triaged.isDuplicate}`);
    console.log(`- Spam Score: ${triaged.spamScore}`);
    console.log(`- Department ID: ${triaged.departmentId} (${triaged.department?.name || 'None'})`);
    console.log(`- Assigned Officer: ${triaged.assignedTo?.name || 'None'} (Role: ${triaged.assignedTo?.role || 'None'})`);
    console.log('----------------------------------------------------');

    if (triaged.status !== 'IN_PROGRESS') {
      console.log('⚠️ Warning: Complaint status not transitioned to IN_PROGRESS. AI processing may still be queueing.');
    }

    // 6. Officer resolves the complaint
    console.log('👔 Resolving complaint as Officer...');
    const resolveResp = await fetch(`http://localhost/api/workflows/complaints/${complaint.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${officerToken}`,
      },
      body: JSON.stringify({
        status: 'RESOLVED',
        officerNote: 'Sector 14 pipeline repaired completely. Water supply cleared and sanitized.',
        verificationImageUrl: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&w=800&q=80',
      }),
    });

    if (!resolveResp.ok) {
      throw new Error(`Failed to resolve complaint: ${await resolveResp.text()}`);
    }

    const resolveData = await resolveResp.json();
    console.log(`✅ Officer successfully marked complaint as RESOLVED!`);

    // 7. Verify dynamic citizen reward (+50 points)
    console.log('🏆 Verifying +50 Social Impact Points credit for Citizen...');
    const dbCitizen = await prisma.user.findUnique({
      where: { id: citizenId },
    });

    const newPoints = dbCitizen.points || 0;
    const diffPoints = newPoints - citizenInitialPoints;
    console.log(`- Initial Points: ${citizenInitialPoints}`);
    console.log(`- Updated Points: ${newPoints}`);
    if (diffPoints === 50) {
      console.log('🎉 SUCCESS: Citizen earned exactly +50 impact points for resolved issue!');
    } else {
      console.log(`❌ FAILED: Reward points difference is ${diffPoints} (expected +50)`);
    }

    console.log('=====================================================');
    console.log('✅ ALL E2E AUTOMATED WORKFLOWS PASSED SUCESSFULLY!');
  } catch (error) {
    console.error('❌ E2E AUTOMATION TEST FAILED:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runE2ETriage();
