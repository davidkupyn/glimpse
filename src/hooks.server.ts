import { pb } from '$lib/pocketbase'
import { redirect } from '@sveltejs/kit'

export const handle = async ({ event, resolve }) => {
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh()
		} catch (_) {
			pb.authStore.clear()
		}
	}

	event.locals.pb = pb
	event.locals.user = structuredClone(pb.authStore.model)

	if (event.url.pathname.startsWith('/rooms') && !pb.authStore.isValid) {
		// check previous requested url and redirect to it after login
		const requestedPage = event.url.pathname
		throw redirect(303, `/signup?redirect=${requestedPage}`)
	}

	const response = await resolve(event)

	response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }))

	return response
}
