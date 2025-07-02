import prismaClient from '$lib/db.server';
import { Visibility, type Account } from '@prisma/client';

type GetListParams = {
	id?: string;
	username?: string;
	slug?: string;
	userId?: string;
};

// async function findList({ id, slug, userId, account }: GetListParams & { account?: Account }) {
// 	return prismaClient.list.findFirst({
// 		where: {
// 			...(account
// 				? {
// 						userId: account.userId,
// 						slug,
// 					}
// 				: slug && userId
// 				? {
// 						slug,
// 						userId,
// 					}
// 				: {
// 						id,
// 					}),
// 			OR: [
// 				{ visibility: Visibility.Public },
// 				{ visibility: Visibility.Unlisted },
// 				userId
// 					? {
// 							AND: [{ userId }, { visibility: Visibility.Private }],
// 						}
// 					: {},
// 			],
// 		},
// 		include: {
// 			items: {
// 				include: {
// 					meta: {
// 						include: {
// 							youtubeMeta: true,
// 						},
// 					},
// 				},
// 			},
// 		},
// 	});
// }

async function findList({ slug, userId, id }: { slug?: string; userId?: string; id?: string }) {
	if (id) {
		return prismaClient.list.findFirst({
			where: { id },
			include: {
				items: {
					include: {
						meta: {
							include: {
								youtubeMeta: true,
							},
						},
					},
				},
			},
		});
	}
	if (slug && userId) {
		return prismaClient.list.findFirst({
			where: { slug, userId },
			include: {
				items: {
					include: {
						meta: {
							include: {
								youtubeMeta: true,
							},
						},
					},
				},
			},
		});
	}
	return null;
}

type ListWithItems = Awaited<Promise<PromiseLike<ReturnType<typeof findList>>>>;

export async function getList({ id, username, slug, userId }: GetListParams) {
	let list: ListWithItems | null = null;
	if (username) {
		const account = await prismaClient.account.findFirst({
			where: {
				provider: 'google',
				username,
			},
		});
		if (!account) {
			return {
				list,
				channelIds: [],
			};
		}
		list = await findList({ slug, userId, account });
	}

	if (!list && slug && userId) {
		list = await findList({ slug, userId });
	}

	if (!list && id) {
		list = await findList({ id });
	}

	const channelIds = list?.items.map((item) => item.meta.originId) || [];
	return { list, channelIds };
}
