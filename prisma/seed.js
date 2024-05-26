const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	// const createBoxData = await prisma.box.create({
	// 	data: {
	// 		box_key: "nonlnwza",
	// 		box_slot_count: 6,
	// 	}
	// });

	const registerBox = await prisma.registeredBox.create({
		data: {
			box_uuid: "f588d3d5-3cee-49e0-8bbc-f9aecb8d0e7a",
			box_name: "TestNonlnwza",
			user_uuid: "58d2ea95-09cc-4b95-92c6-7273716fb020",
		}
	});

	console.log(registerBox);


}
main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});