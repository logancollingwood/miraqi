export interface QueueItem {
    id: string,
    playUrl: string,
    userId: Object;
    trackName: string,
    lengthSeconds: number,
    type: string,
    playTime: Date;
    updatedAt: Date;
    roomId: string;
}