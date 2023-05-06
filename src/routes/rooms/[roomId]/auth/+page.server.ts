import { redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const schema = z.object({
	password: z.string().min(4)
})

export const load = async () => {
	const form = await superValidate(schema)

	return {
		form
	}
}

export const actions = {
	default: async ({ locals, request, params }) => {
		const form = await superValidate(request, schema)
		if (!form.valid) {
			return { form }
		}

		const room = await locals.pb.collection('rooms').getOne(params.roomId)
		const valid = await bcrypt.compare(form.data.password, room.export().password)
		if (!valid) {
			setError(form, 'password', 'Incorrect password')
			return { form }
		}

		throw redirect(303, `/rooms/${params.roomId}?password=${room.export().password}`)
	}
}
