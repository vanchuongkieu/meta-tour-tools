import ViewerControl from '@/components/ViewerControl';
import Viewer from '@/tools/viewer';
import type {GetStaticProps, NextPage} from 'next';
import {useState} from 'react';

const Home: NextPage = ({rooms, roomMenu}: any) => {
  const [roomId, setRoomId] = useState<string>('');

  return (
    <div className="panoramas">
      <Viewer
        keyboard
        menu={roomMenu}
        onLoad={setRoomId}
        onDraggable={console.log}
        onError={console.log}>
        {rooms.map((room: any) => (
          <Viewer.Room {...room} key={room.id} />
        ))}
      </Viewer>
      <ViewerControl roomId={roomId} menu={roomMenu} />
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
      hfov: 120,
      panoramaImage:
        'https://res.cloudinary.com/lavana/image/upload/v1658403646/panoramas/25_6_2022_fpoly_1_-_Panorama_4_-_Panorama_jtzttr_psixha.jpg',
      compass: true,
      markers: [
        {
          id: 'hs1',
          pitch: -0.5863365768080424,
          yaw: 110.88908641173171,
          icon: 'location-dot',
          type: 'marker',
          idRoom: 'scene1',
          tooltipType: 'room_name',
          tooltipText: 'Tooltip 1',
          animation: 'heart-heat-a',
          transform3d: false,
          rotateX: 0,
          rotateZ: 0,
          scale: true,
          object: 'marker',
          idRoomTarget: 'scene2',
          nameRoomTarget: 'Room 2',
          transitionZoom: 20,
          timeAnimated: 600,
          lookAt: false,
        },
        {
          id: 'hs3',
          pitch: -6.5863365768080424,
          yaw: 110.88908641173171,
          icon: 'location-dot',
          type: 'link_ext',
          content: 'tel:0982940000',
          idRoom: 'scene1',
          tooltipType: 'image',
          tooltipText: 'Tooltip 1',
          tooltipImage:
            'https://lafactoriaweb.com/wp-content/uploads/2020/10/Demo_la_gi_04.jpg',
          animation: 'heart-heat-a',
          transform3d: false,
          rotateX: 0,
          rotateZ: 0,
          scale: true,
          object: 'pointer',
          idRoomTarget: '',
          nameRoomTarget: '',
          transitionZoom: 20,
          timeAnimated: 600,
          lookAt: false,
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
      hfov: 120,
      compass: true,
      friction: 0.3,
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
          tooltipText: 'Tooltip 1',
          transform3d: false,
          rotateX: 70,
          rotateZ: 0,
          idRoom: 'scene2',
          animation: 'pulse-a',
          scale: true,
          sizeScale: 1.5,
          object: 'marker',
          idRoomTarget: 'scene1',
          nameRoomTarget: 'Room 1',
          transitionZoom: 20,
          timeAnimated: 600,
          lookAt: true,
        },
      ],
    },
  ];

  const roomMenu = [
    {
      name: 'Scene 1',
      image: '',
      roomId: 'scene1',
    },
    {
      name: 'Scene 2',
      image: '',
      roomId: 'scene2',
    },
  ];

  return {
    props: {
      rooms,
      roomMenu,
    },
  };
};

export default Home;
