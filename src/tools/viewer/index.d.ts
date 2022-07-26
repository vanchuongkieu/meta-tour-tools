export interface RoomPropsType {
  id: string;
  type: 'image';
  name: string;
  song?: string;
  idMap?: string;
  panoramaImage?: string;
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
  tooltipText?: string;
  tooltipImage?: string;
  tooltipType: 'room_name' | 'text' | 'image';
  content?: string; // JSON stringify
  idRoomTarget?: string;
  nameRoomTarget?: string;
  pitchRoomTarget?: number;
  yawRoomTarget?: number;
  object?: 'pointer' | 'marker';
  type?: 'video' | 'gallery' | 'marker' | 'link_ext' | 'form' | 'modal';
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
  background?: string | number[];
  color?: string | number[];
  cssClass?: string;
  lookAt?: boolean;
  transitionZoom?: number;
  timeAnimated?: number;
  draggable?: boolean;
}

export type CoordsType = {
  pitch: number;
  yaw: number;
  maxPitch?: number;
  maxYaw?: number;
  minPitch?: number;
  minYaw?: number;
};

interface ViewerPropsType {
  menu?: RecordType[];
  draggable?: boolean;
  keyboard?: boolean;
  children?: React.ReactNode;
  onMouseMove?: (coords: CoordsType) => void;
  onDraggable?: (maker: MarkerPropsType) => void;
  onMouseWheel?: (hfov: number) => void;
  onError?: (message: string) => void;
  onLoad?: (idRoom: string) => void;
}

function Viewer(props: ViewerPropsType): JSX.Element;

namespace Viewer {
  export function Room(props: RoomPropsType): JSX.Element;
  export function setPitch(pitch: number): void;
  export function setPitchBounds(bounds: number[]): void;
  export function setYaw(yaw: number): void;
  export function setYawBounds(bounds: number[]): void;
  export function loadRoom(
    idRoom: string,
    targetPitch?: number,
    targetYaw?: number,
    targetHfov?: number
  ): void;
  export function startOrientation(): void;
  export function stopOrientation(): void;
  export function gotoNextroom(): void;
  export function gotoPrevroom(): void;
  export function isOrientationSupport(): boolean;
  export function handleFullscreen(): boolean;
  export function gotoLeft(): void;
  export function gotoRight(): void;
  export function gotoUp(): void;
  export function gotoDown(): void;
  export function zoomIn(): void;
  export function zoomOut(): void;
  export function getRoom(): string;
}

export default Viewer;
