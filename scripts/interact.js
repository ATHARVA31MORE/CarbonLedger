const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const carbonLedgerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your deployed CarbonLedger address
  const CarbonLedger = await hre.ethers.getContractFactory("CarbonLedger");
  const carbonLedger = await CarbonLedger.attach(carbonLedgerAddress).connect(deployer);

  console.log(`Interacting with CarbonLedger at ${carbonLedgerAddress}`);
  console.log(`✅ Using deployer account: ${deployer.address}`);

  // Check contract owner
  const owner = await carbonLedger.owner();
  console.log(`✅ Contract owner is: ${owner}`);

  if (deployer.address !== owner) {
    console.error(`❌ ERROR: Deployer account is NOT the contract owner. Use the correct signer.`);
    process.exit(1);
  }

  // List of sample green projects to add
  const projects = [
    { name: "Solar Train Route", type: "Electrification", co2: 100 },
    { name: "Wind Energy Station", type: "Renewable", co2: 150 },
    { name: "LED Platform Lighting", type: "Efficiency", co2: 50 },
    { name: "Biofuel Locomotive", type: "Alternative Fuel", co2: 200 },
  ];

  // Add projects in a loop
  for (const proj of projects) {
    const tx = await carbonLedger.addGreenProject(proj.name, proj.type, proj.co2);
    await tx.wait();
    console.log(`✅ Added: ${proj.name} (${proj.co2} tons CO₂ saved)`);
  }

  // Retrieve and display all projects
  const projectCount = await carbonLedger.getProjectCount();
  console.log(`\n📦 Total projects stored: ${projectCount}`);

  for (let i = 0; i < projectCount; i++) {
    const proj = await carbonLedger.getProject(i);
    console.log(
      `#${i + 1} → ${proj[0]} (${proj[1]}) saved ${proj[2]} tons CO₂ → issued ${hre.ethers.formatEther(proj[3])} tokens`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
