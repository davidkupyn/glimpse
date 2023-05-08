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

		const newUser = {
			email: form.data.email,
			password: form.data.password,
			passwordConfirm: form.data.password,
			username: form.data.email.split('@')[0]
		}

		try {
			await locals.pb.collection('users').create(newUser)
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password)
		} catch (error) {
			console.error(error)
			return setError(form, 'email', 'User already exists')
		}

		throw redirect(303, url.searchParams.get('redirect') || '/rooms')
	}
}
