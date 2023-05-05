import bcrypt from 'bcrypt'

export const serializeNonPOJOs = <T>(obj: T): T => {
	return structuredClone(obj)
}

export async function hashPassword(password: string | undefined): Promise<string | undefined> {
	if (!password) {
		return undefined
	}

	const saltRounds = 10
	const hashedPassword = await bcrypt.hash(password, saltRounds)
	return hashedPassword
}
