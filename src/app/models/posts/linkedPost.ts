export interface CarouselItem {
  link?: string;
  name?: string;
  description?: string;
  picture?: string;
  video?: string;
  call_to_action?: CallToAction;
}

export interface CallToAction {
  type: string;
  value: {
    link: string;
  };
}

export interface LinkedSubtype {
  link: string;
  call_to_action: CallToAction;
}

export interface CarouselSubtype {
  link: string;
  child_attachments: CarouselItem[];
}

export interface LinkedPost {
  channels: string[];
  message: string;
  timezone: string;
  schedule_timestamp?: number;
  subtype: string;
  subtype_meta: LinkedSubtype;
}

export interface CarouselPost {
  channels: string[];
  message: string;
  timezone: string;
  schedule_timestamp?: number;
  subtype: string;
  subtype_meta: CarouselSubtype;
}

export interface GeneralLinkedPost {
  channels: string[];
  timezone: string;
  subtype: string;
  callToActionButton?: GeneralCTAButton;
}

export interface GeneralCarouselItem {
  link: string;
  name: string;
  description: string;
  file: FileType;
}

export interface FileType {
  file?: File;
  type: string;
  url: string;
  presignedUrl?: string;
  base64?: string;
  name?: string;
}


export interface GeneralCTAButton {
  key: string;
  value: string;
}
