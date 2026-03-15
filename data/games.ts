export type GameStatus = 'available' | 'coming-soon'

export interface GameData {
    id: string
    icon: string
    titleKey: string
    descKey: string
    statusKey: string
    status: GameStatus
    playUrl: string | null
}

const SUBWAY_GAME_URL = process.env.NEXT_PUBLIC_SUBWAY_GAME_URL || ''

export const games: GameData[] = [
    {
        id: 'drone',
        icon: '✍️',
        titleKey: 'games.drone.title',
        descKey: 'games.drone.desc',
        statusKey: 'games.drone.status',
        status: 'available',
        playUrl: null, // Update when available
    },
    {
        id: 'subway',
        icon: '🚇',
        titleKey: 'games.subway.title',
        descKey: 'games.subway.desc',
        statusKey: 'games.subway.status',
        status: 'available',
        playUrl: SUBWAY_GAME_URL || null,
    },
    {
        id: 'robot',
        icon: '🤖',
        titleKey: 'games.robot.title',
        descKey: 'games.robot.desc',
        statusKey: 'games.robot.status',
        status: 'coming-soon',
        playUrl: null,
    },
    {
        id: 'nav',
        icon: '🗺️',
        titleKey: 'games.nav.title',
        descKey: 'games.nav.desc',
        statusKey: 'games.nav.status',
        status: 'coming-soon',
        playUrl: null,
    },
    {
        id: 'more',
        icon: '🎮',
        titleKey: 'games.more.title',
        descKey: 'games.more.desc',
        statusKey: 'games.more.status',
        status: 'coming-soon',
        playUrl: null,
    },
]
