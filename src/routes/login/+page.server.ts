import { fail, redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
})

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/rooms')
	}
	const form = await superValidate(schema)
	return { form }
}

export const actions = {
	default: async ({ locals, request, url }) => {
		const form = await superValidate(request, schema)
		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password)
		} catch (error) {
			console.error(error)
			setError(form, 'email', 'Invalid email or password')
			return setError(form, 'password', 'Invalid email or password')
		}

		throw redirect(303, url.searchParams.get('redirect') || '/rooms')
	}
}
