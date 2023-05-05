import { redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const schema = z.object({
	password: z.string().min(4),
	id: z.string().length(15)
})

export const load = async ({ locals, depends }) => {
	if (!locals.user) {
		throw redirect(303, '/signup')
	}
	depends('rooms')
	const rooms = (await locals.pb.collection('rooms').getFullList(200, { sort: '-created' })).filter(
		(room) =>
			room.export().creator === locals?.user?.id ||
			room.export().participants.includes(locals?.user?.id)
	)
	const form = await superValidate(schema)

	return {
		form,
		rooms: rooms.map((room) => {
			const roomExport = room.export()
			delete roomExport.password
			return roomExport
		})
	}
}

export const actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, schema)
		console.log(form)
		if (!form.valid) {
			return { form }
		}

		const room = await locals.pb.collection('rooms').getOne(form.data.id)
		const valid = await bcrypt.compare(form.data.password, room.export().password)
		if (!valid) {
			setError(form, 'password', 'Incorrect password')
			return { form }
		}

		throw redirect(303, `/rooms/${form.data.id}?password=${room.export().password}`)
	}
}
