import { error, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
	content: z.string().min(3),
	description: z.string().min(3).optional()
})

const joinSchema = z.object({})

export const load = async ({ locals, params, url }) => {
	const form = await superValidate(schema)
	const joinForm = await superValidate(joinSchema)
	const leaveForm = await superValidate(joinSchema)
	const startForm = await superValidate(joinSchema)
	const password = url.searchParams.get('password')
	const room = await locals.pb
		.collection('rooms')
		.getOne(params.roomId, {
			expand: 'options(room)'
		})
		.catch(() => {
			throw error(404, { message: 'Room does not exist' })
		})
		.then((room) => room.export())
	if (
		room.private &&
		room.password !== password &&
		!room.winner &&
		room.creator !== locals?.user?.id
	)
		throw redirect(303, `/rooms/${params.roomId}/auth`)
	const options = room.expand['options(room)']

	return {
		room,
		options,
		form,
		joinForm,
		leaveForm,
		startForm,
		joined: room.participants.includes(locals?.user?.id),
		enteredOption:
			options && !!options?.some(({ author }: { author: string }) => author === locals?.user?.id)
	}
}

export const actions = {
	createOption: async ({ locals, request, params }) => {
		const form = await superValidate(request, schema)
		if (!form.valid) {
			return { form }
		}
		await locals.pb.collection('options').create({
			content: form.data.content,
			description: form.data.description,
			author: locals?.user?.id,
			room: params.roomId
		})
		return { form }
	},
	join: async ({ locals, request, params }) => {
		const form = await superValidate(request, joinSchema)
		if (!form.valid) {
			return { form }
		}
		const room = await locals.pb.collection('rooms').getOne(params.roomId)
		await locals.pb.collection('rooms').update(params.roomId, {
			participants: [...room.participants, locals?.user?.id]
		})
		return { form }
	},
	leave: async ({ locals, request, params }) => {
		const form = await superValidate(request, joinSchema)
		if (!form.valid) {
			return { form }
		}
		const room = await locals.pb.collection('rooms').getOne(params.roomId, {
			expand: 'options(room)'
		})
		const options = room.export().expand['options(room)']
		if (options && options?.some(({ author }: { author: string }) => author === locals?.user?.id)) {
			return { form }
		}
		await locals.pb.collection('rooms').update(params.roomId, {
			participants: room.participants.filter((p: string) => p !== locals?.user?.id)
		})
		return { form }
	},
	start: async ({ locals, request, params }) => {
		const form = await superValidate(request, joinSchema)
		if (!form.valid) {
			return { form }
		}
		const room = await locals.pb.collection('rooms').getOne(params.roomId)
		if (room.export().creator !== locals?.user?.id) {
			return { form }
		}
		await locals.pb.collection('rooms').update(params.roomId, {
			started: true
		})
		return { form }
	}
}
