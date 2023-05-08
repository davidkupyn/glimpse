import { error, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
	content: z.string().min(3),
	description: z.string().min(3).optional()
})

const joinSchema = z.object({})

const voteSchema = z.object({
	option: z.string().length(15)
})

export const load = async ({ locals, params, url, depends }) => {
	depends('room')
	const form = await superValidate(schema)
	const joinForm = await superValidate(joinSchema)
	const leaveForm = await superValidate(joinSchema)
	const startForm = await superValidate(joinSchema)
	const voteForm = await superValidate(voteSchema)

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

	const isCreator = room.creator === locals?.user?.id

	if (room.private && room.password !== password && !room.winner && !isCreator)
		throw redirect(303, `/rooms/${params.roomId}/auth`)
	const options = room.expand['options(room)']

	return {
		room,
		options,
		form,
		joinForm,
		leaveForm,
		startForm,
		voteForm,
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

		if (room.started) {
			return { form }
		}

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
	},
	vote: async ({ locals, params, url }) => {
		const form = await superValidate(url, voteSchema)

		if (!form.valid) {
			return { form }
		}

		const room = await locals.pb.collection('rooms').getOne(params.roomId, {
			expand: 'options(room)'
		})

		if (room.winner || !room.started) {
			return { form }
		}
		const options = room.export().expand['options(room)']
		const option = options.find(({ id }: { id: string }) => id === form.data.option)

		const voted = !!options.some(({ votes }: { votes: string[] }) =>
			votes.includes(locals?.user?.id || '')
		)

		if (voted || !option || !room.started) {
			return { form }
		}

		await locals.pb.collection('options').update(form.data.option, {
			votes: [...option.votes, locals?.user?.id]
		})

		const votesCount: number =
			options
				.map(({ votes }: { votes: string[] }) => votes.length)
				.reduce((partialSum: number, a: number) => partialSum + a, 0) + 1
		const allParticipantsVoted = votesCount === room.participants.length
		console.log(allParticipantsVoted)
		if (allParticipantsVoted) {
			const winner = options.reduce(
				(
					prev: {
						votes: string[]
					},
					curr: {
						votes: string[]
					}
				) => (prev.votes.length > curr.votes.length ? prev : curr)
			)
			await locals.pb.collection('rooms').update(params.roomId, {
				winner: winner.id
			})
		}

		return { form }
	}
}
