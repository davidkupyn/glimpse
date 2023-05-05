import { hashPassword } from '$lib/utils.js'
import { fail, redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
	id: z.string().length(15),
	title: z.string().min(3),
	description: z.string().min(3).optional(),
	private: z.number().int().min(0).max(1),
	password: z.string().min(4).optional()
})

export async function load() {
	const form = await superValidate(schema)
	return { form }
}

export const actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, schema)

		if (form.data.private && !form.data.password) {
			setError(form, 'password', 'Password is required for private rooms')
		}
		if (!form.valid) {
			return fail(400, { form })
		}
		const hashedPassword = await hashPassword(form.data.password)
		try {
			await locals.pb.collection('rooms').create({
				...form.data,
				creator: locals?.user?.id,
				password: hashedPassword,
				private: !!form.data.private
			})
		} catch (error) {
			console.error(error)
		}

		throw redirect(
			303,
			`/rooms/${form.data.id}${hashedPassword ? `?password=${hashedPassword}` : ''}`
		)
	}
}
