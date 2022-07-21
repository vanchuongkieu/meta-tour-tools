export interface RoomPropsType {
  id: string;
  type: 'image';
  name: string;
  song?: string;
  idMap?: string;
  panoramaImage?: string;
  panoramaBlob?: string;
  songVolume?: number;
  pitch?: number;
  maxPitch?: number;
  minPitch?: number;
  yaw?: number;
  maxYaw?: number;
  minYaw?: number;
  hfov?: number;
  minHfov?: number;
  maxHfov?: number;
  northOffset?: number;
  allowPitch?: boolean;
  allowYaw?: boolean;
  haov?: number;
  vaov?: number;
  compass?: boolean;
  annotationTitle?: string;
  annotationDescription?: string;
  markers?: MarkerPropsType[];
  backgroundColor?: number[];
}

export interface MarkerPropsType {
  id?: string;
  yaw?: number;
  icon?: string;
  pitch?: number;
  tooltip_text?: string;
  tooltip_type: 'room_name' | 'text';
  content?: string; // JSON stringify
  idRoomTarget?: string;
  nameRoomTarget?: string;
  pitchRoomTarget?: number;
  yawRoomTarget?: number;
  object?: 'pointer' | 'marker';
  type?: 'video' | 'gallery' | 'marker' | 'link_ext' | 'form';
  linkTaret?: '_blank';
  embedType?: 'video' | 'gallery';
  embedCoords?: string; // JSON stringify
  embedContent?: string; // JSON stringify
  embedSize?: number[];
  animation?: string;
  scale?: boolean;
  rotateX?: number;
  rotateZ?: number;
  transform3d?: boolean;
  sizeScale?: number;
  background?: string;
  color?: string;
  cssClass?: string;
  lookAt?: boolean;
}

interface ViewerPropsType {
  children?: React.ReactNode;
}

function Viewer(props: ViewerPropsType): JSX.Element;

namespace Viewer {
  export function Room(props: RoomPropsType): JSX.Element;
}

export default Viewer;
