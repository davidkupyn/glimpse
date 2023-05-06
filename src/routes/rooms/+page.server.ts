import { redirect } from '@sveltejs/kit'

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

	return {
		rooms: rooms.map((room) => {
			const roomExport = room.export()
			delete roomExport.password
			return roomExport
		})
	}
}
