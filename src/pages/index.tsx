import Viewer from '@/tools/viewer';
import type {GetStaticProps, NextPage} from 'next';

const Home: NextPage = ({rooms}: any) => {
  return (
    <Viewer>
      {rooms.map((room: any) => (
        <Viewer.Room {...room} key={room.id} />
      ))}
    </Viewer>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const rooms = [
    {
      id: 'scene1',
      type: 'image',
      name: 'Room 1',
      pitch: 0,
      yaw: 112,
      hfov: 120,
      panoramaImage:
        'https://res.cloudinary.com/lavana/image/upload/v1657586907/panoramas/25_6_2022_fpoly_1_-_Panorama_4_-_Panorama_jtzttr.jpg',
      compass: true,
      markers: [
        {
          id: 'hs1',
          pitch: -0.5863365768080424,
          yaw: 110.88908641173171,
          icon: 'location-dot',
          type: 'scene',
          tooltipType: 'room_name',
          tooltipText: 'Tooltip 1',
          animation: 'heart-heat-a',
          transform3d: false,
          rotateX: 0,
          rotateZ: 0,
          scale: true,
          sizeScale: 1,
          object: 'marker',
          idRoomTarget: 'scene2',
          nameRoomTarget: 'Room 2',
          transitionZoom: 20,
          timeAnimated: 500,
          lookAt: true,
        },
      ],
    },
    {
      id: 'scene2',
      type: 'image',
      name: 'Room 2',
      pitch: 2,
      yaw: -7.6,
      hfov: 120,
      compass: true,
      panoramaImage:
        'https://res.cloudinary.com/lavana/image/upload/v1657586905/panoramas/25_6_2022_fpoly_1_-_Panorama_5_-_Panorama_bp9w3r.jpg',
      markers: [
        {
          id: 'hs4',
          pitch: -6.4,
          yaw: -7.6,
          icon: 'location-dot',
          type: 'scene',
          tooltipType: 'text',
          tooltipText: 'Tooltip 2',
          transform3d: false,
          rotateX: 60,
          rotateZ: -2,
          id_room: 'scene3',
          animation: 'pulse-a',
          scale: true,
          sizeScale: 1.5,
          object: 'marker',
          idRoomTarget: 'scene1',
          nameRoomTarget: 'Room 1',
          transitionZoom: 10,
          timeAnimated: 400,
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
