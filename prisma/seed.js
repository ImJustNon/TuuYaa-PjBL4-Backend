const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	const testAddUser = await prisma.user.create({
		data: {
			user_name: "non",
			user_email: "kanakornthaiprakhon@gmail.com",
			user_password_hash: "dghsdhsdgsdgdsfg",
			user_token: "asdaldskfsdfgsdfgkjsldfkgjs;dlfkgjsld;hsdlkjfghlkdjsfhjhaskdjlhakdsjlhdskjj"
		}
	});

	console.log(testAddUser);


}
main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});