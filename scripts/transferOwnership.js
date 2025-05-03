const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const greenTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed GreenToken address
  const carbonLedgerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your deployed CarbonLedger address

  const GreenToken = await hre.ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.attach(greenTokenAddress).connect(deployer);

  console.log(`Transferring GreenToken ownership from deployer (${deployer.address}) to CarbonLedger (${carbonLedgerAddress})...`);

  const tx = await greenToken.transferOwnership(carbonLedgerAddress);
  await tx.wait();

  console.log("✅ Ownership transfer complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
