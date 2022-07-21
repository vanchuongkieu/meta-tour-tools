import Viewer from '@/tools/viewer';
import type {GetStaticProps, NextPage} from 'next';

const Home: NextPage = ({rooms}: any) => {
  return (
    <div className="panoramas">
      <Viewer>
        {rooms.map((room: any) => (
          <Viewer.Room {...room} key={room.id} />
        ))}
      </Viewer>
      <Viewer.Compass />
    </div>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const rooms = [
    {
      id: 'scene1',
      type: 'image',
      name: 'Room 1',
      pitch: 0,
      minPitch: 0,
      maxPitch: 0,
      yaw: 67,
      minYaw: -67,
      maxYaw: 120,
      hfov: 90,
      panoramaImage:
        'https://res.cloudinary.com/lavana/image/upload/v1658403646/panoramas/25_6_2022_fpoly_1_-_Panorama_4_-_Panorama_jtzttr_psixha.jpg',
      compass: true,
      markers: [
        {
          id: 'hs1',
          pitch: -0.5863365768080424,
          yaw: 110.88908641173171,
          icon: 'location-dot',
          type: 'scene',
          idRoom: 'scene1',
          tooltipType: 'room_name',
          tooltipText: 'Tooltip 1',
          animation: 'heart-heat-a',
          transform3d: false,
          rotateX: 0,
          rotateZ: 0,
          scale: false,
          sizeScale: 1.5,
          object: 'marker',
          idRoomTarget: 'scene2',
          nameRoomTarget: 'Room 2',
          transitionZoom: 0,
          timeAnimated: 500,
          lookAt: true,
        },
      ],
    },
    {
      id: 'scene2',
      type: 'image',
      name: 'Room 2',
      pitch: 0,
      minPitch: 0,
      maxPitch: 0,
      yaw: -4,
      minYaw: -120,
      maxYaw: 120,
      hfov: 90,
      compass: true,
      panoramaImage:
        'https://res.cloudinary.com/lavana/image/upload/v1658403596/panoramas/25_6_2022_fpoly_1_-_Panorama_5_-_Panorama_bp9w3r_ntfuvj.jpg',
      markers: [
        {
          id: 'hs2',
          pitch: -6.4,
          yaw: -7.6,
          icon: 'location-dot',
          type: 'scene',
          tooltipType: 'text',
          tooltipText: 'Tooltip 2',
          transform3d: false,
          rotateX: 60,
          rotateZ: 0,
          idRoom: 'scene2',
          animation: 'pulse-a',
          scale: false,
          sizeScale: 1.5,
          object: 'marker',
          idRoomTarget: 'scene3',
          nameRoomTarget: 'Room 3',
          transitionZoom: 20,
          timeAnimated: 500,
          lookAt: true,
        },
      ],
    },
    {
      id: 'scene3',
      type: 'image',
      name: 'Room 3',
      pitch: 0,
      minPitch: 0,
      maxPitch: 0,
      yaw: 67,
      minYaw: -67,
      maxYaw: 120,
      hfov: 90,
      panoramaImage:
        'https://res.cloudinary.com/lavana/image/upload/v1658403646/panoramas/25_6_2022_fpoly_1_-_Panorama_4_-_Panorama_jtzttr_psixha.jpg',
      compass: true,
      markers: [
        {
          id: 'hs3',
          pitch: -0.5863365768080424,
          yaw: 110.88908641173171,
          icon: 'location-dot',
          type: 'scene',
          idRoom: 'scene3',
          tooltipType: 'room_name',
          tooltipText: 'Tooltip 3',
          animation: 'heart-heat-a',
          transform3d: false,
          rotateX: 0,
          rotateZ: 0,
          scale: false,
          sizeScale: 1.5,
          object: 'marker',
          idRoomTarget: 'scene4',
          nameRoomTarget: 'Room 4',
          transitionZoom: 0,
          timeAnimated: 500,
          lookAt: true,
        },
      ],
    },
    {
      id: 'scene4',
      type: 'image',
      name: 'Room 4',
      pitch: 0,
      minPitch: 0,
      maxPitch: 0,
      yaw: -4,
      minYaw: -120,
      maxYaw: 120,
      hfov: 90,
      compass: true,
      panoramaImage:
        'https://res.cloudinary.com/lavana/image/upload/v1658403596/panoramas/25_6_2022_fpoly_1_-_Panorama_5_-_Panorama_bp9w3r_ntfuvj.jpg',
      markers: [
        {
          id: 'hs4',
          pitch: -6.4,
          yaw: -7.6,
          icon: 'location-dot',
          type: 'scene',
          tooltipType: 'text',
          tooltipText: 'Tooltip 4',
          transform3d: false,
          rotateX: 60,
          rotateZ: 0,
          idRoom: 'scene4',
          animation: 'pulse-a',
          scale: false,
          sizeScale: 1.5,
          object: 'marker',
          idRoomTarget: 'scene1',
          nameRoomTarget: 'Room 1',
          transitionZoom: 20,
          timeAnimated: 500,
          lookAt: true,
        },
      ],
    },
  ];

  return {
    props: {
      rooms,
    },
  };
};

export default Home;
