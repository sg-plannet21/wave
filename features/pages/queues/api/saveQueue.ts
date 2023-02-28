import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Queue } from '../types';

type EditQueue = {
  id: string;
  priority: number;
  whisperMessage?: string;
  queueWelcome?: string;
  queueMusic: string;
  queueMessage1?: string;
  queueMessage2?: string;
  queueMessage3?: string;
  queueMessage4?: string;
  queueMessage5?: string;
  closedToggle: boolean;
  closedMessage?: string;
  closedRoute?: string;
  noAgentsToggle: boolean;
  noAgentsMessage?: string;
  noAgentsRoute?: string;
  maxQueueCallsToggle: boolean;
  maxQueueCallsThreshold?: string;
  maxQueueCallsMessage?: string;
  maxQueueCallsRoute?: string;
  maxQueueTimeToggle: boolean;
  maxQueueTimeThreshold?: string;
  maxQueueTimeMessage?: string;
  maxQueueTimeRoute?: string;
  callbacksToggle: boolean;
  callbackCallsThreshold?: string;
  callbackTimeThreshold?: string;
  callbackRoute?: string;
};

function mapMessageToDto(message?: string): number | null {
  return message ? parseInt(message) : null;
}

function mapRouteToDto(route?: string): string | null {
  return route ? route : null;
}

function mapToDto(data: EditQueue): Partial<Queue> {
  return {
    queue_id: data.id,
    queue_priority: data.priority,
    whisper_message: mapMessageToDto(data.whisperMessage),
    queue_welcome: mapMessageToDto(data.queueWelcome),
    queue_music: parseInt(data.queueMusic),
    queue_message_1: mapMessageToDto(data.queueMessage1),
    queue_message_2: mapMessageToDto(data.queueMessage2),
    queue_message_3: mapMessageToDto(data.queueMessage3),
    queue_message_4: mapMessageToDto(data.queueMessage4),
    queue_message_5: mapMessageToDto(data.queueMessage5),
    closed_toggle: data.closedToggle,
    closed_message: data.closedToggle
      ? mapMessageToDto(data.closedMessage)
      : null,
    closed_route: data.closedToggle ? mapRouteToDto(data.closedRoute) : null,
    no_agents_toggle: data.noAgentsToggle,
    no_agents_message: data.noAgentsToggle
      ? mapMessageToDto(data.noAgentsMessage)
      : null,
    no_agents_route: data.noAgentsToggle
      ? mapRouteToDto(data.noAgentsRoute)
      : null,

    max_queue_calls_toggle: data.maxQueueCallsToggle,
    max_queue_calls_message: data.maxQueueCallsToggle
      ? mapMessageToDto(data.maxQueueCallsMessage)
      : null,
    max_queue_calls_route: data.maxQueueCallsToggle
      ? mapRouteToDto(data.maxQueueCallsRoute)
      : null,

    max_queue_calls_threshold:
      data.maxQueueCallsToggle &&
      typeof data.maxQueueCallsThreshold === 'number'
        ? data.maxQueueCallsThreshold
        : null,

    max_queue_time_toggle: data.maxQueueTimeToggle,

    max_queue_time_threshold:
      data.maxQueueCallsToggle && typeof data.maxQueueTimeThreshold === 'number'
        ? data.maxQueueTimeThreshold
        : null,

    max_queue_time_message: data.maxQueueTimeToggle
      ? mapMessageToDto(data.maxQueueTimeMessage)
      : null,
    max_queue_time_route: data.maxQueueTimeToggle
      ? mapRouteToDto(data.maxQueueTimeRoute)
      : null,

    callback_toggle: data.callbacksToggle,
    callback_calls_threshold:
      data.callbacksToggle && typeof data.callbackCallsThreshold === 'number'
        ? data.callbackCallsThreshold
        : null,

    callback_time_threshold:
      data.callbacksToggle && typeof data.callbackTimeThreshold === 'number'
        ? data.callbackTimeThreshold
        : null,

    callback_route: data.callbacksToggle
      ? mapRouteToDto(data.callbackRoute)
      : null,
  };
}

export function saveQueue(
  data: EditQueue
): Promise<AxiosResponse<Queue, WaveError>> {
  const payload = mapToDto(data);
  console.log('payload :>> ', payload);
  return axios.patch(`/queues/${data.id}/`, payload);
}
