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
  noAgentToggle: boolean;
  noAgentMessage?: string;
  noAgentRoute?: string;
  maxQueueCallsToggle: boolean;
  maxQueueCallsMessage?: string;
  maxQueueCallsRoute?: string;
  maxQueueTimeToggle: boolean;
  maxQueueTimeMessage?: string;
  maxQueueTimeRoute?: string;
  callbackToggle: boolean;
  callbackCallsThreshold?: number;
  callbackTimeThreshold?: number;
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
    no_agents_toggle: data.noAgentToggle,
    no_agents_message: data.noAgentToggle
      ? mapMessageToDto(data.noAgentMessage)
      : null,
    no_agents_route: data.noAgentToggle
      ? mapRouteToDto(data.noAgentRoute)
      : null,
    max_queue_calls_toggle: data.maxQueueCallsToggle,
    max_queue_calls_message: data.maxQueueCallsToggle
      ? mapMessageToDto(data.maxQueueCallsMessage)
      : null,
    max_queue_calls_route: data.maxQueueCallsToggle
      ? mapRouteToDto(data.maxQueueCallsRoute)
      : null,
    max_queue_time_toggle: data.maxQueueTimeToggle,
    max_queue_time_message: data.maxQueueTimeToggle
      ? mapMessageToDto(data.maxQueueTimeMessage)
      : null,
    max_queue_time_route: data.maxQueueTimeToggle
      ? mapRouteToDto(data.maxQueueTimeRoute)
      : null,
    callback_toggle: data.callbackToggle,
    callback_calls_threshold: data.callbackToggle
      ? data.callbackCallsThreshold
      : null,
    callback_time_threshold: data.callbackToggle
      ? data.callbackTimeThreshold
      : null,
  };
}

export function saveQueue(
  data: EditQueue
): Promise<AxiosResponse<Queue, WaveError>> {
  const payload = mapToDto(data);
  return axios.patch(`/menus/${data.id}/`, payload);
}
