const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	const createBoxData = await prisma.box.create({
		data: {
			box_key: "nonlnwza",
			box_slot_count: 6,
		}
	});

	console.log(createBoxData);


}
main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});