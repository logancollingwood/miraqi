import { QueueItem } from "./QueueItem";

export interface JobQueueItem {
    queueItemThatHasBeenPlayed: QueueItem,
    roomId: string
}