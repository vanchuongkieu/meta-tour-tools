import {
  BiArrowFromTop,
  BiCaretDown,
  BiCaretLeft,
  BiCaretRight,
  BiCaretUp,
  BiCollapse,
  BiExpand,
  BiFastForward,
  BiGridAlt,
  BiMinus,
  BiPlus,
  BiRewind,
} from 'react-icons/bi';
import {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import Viewer from '@/tools/viewer';

interface Props {
  roomId: string;
  menu: any[];
}

const ViewerControl = ({roomId, menu}: Props) => {
  const [swiper, setSwiper] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [isControl, setIsControl] = useState<boolean>(false);

  useEffect(() => {
    const filteredIndex = menu.findIndex((item) => item.roomId === roomId);
    swiper?.slideTo(filteredIndex);
  }, [roomId]);

  const toggleFullscreen = () => {
    const isFullscreen = Viewer.handleFullscreen();
    setFullscreen(isFullscreen);
  };

  const toggleControl = () => {
    !isControl && setShow(false);
    setIsControl(!isControl);
  };

  return (
    <>
      {isControl && (
        <BiCaretUp
          size={30}
          className="center-bottom-controls-button-show"
          onClick={toggleControl}
        />
      )}
      <div className={`center-bottom-controls${isControl ? ' hidden' : ''}`}>
        <div className={`menu${!show ? ' hidden' : ''}`}>
          <Swiper
            breakpoints={{
              400: {
                slidesPerView: 2,
              },
              700: {
                slidesPerView: 4,
              },
            }}
            onSwiper={setSwiper}
            spaceBetween={5}>
            {menu.map((item, index) => (
              <SwiperSlide
                key={index}
                className={`${
                  item.roomId === roomId ? 'menu-slide-active' : ''
                }`}
                onClick={() => Viewer.loadRoom(item.roomId)}>
                {item.roomId}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <BiRewind
          className="btn-control"
          size={30}
          onClick={Viewer.gotoPrevroom}
        />
        <BiGridAlt
          size={22}
          className="btn-control"
          onClick={() => setShow(!show)}
        />
        {/* <BiVolumeFull className="btn-control" size={22} /> */}
        {/* <BiVolumeMute size={26} /> */}
        {!Viewer.isOrientationSupport() && (
          <>
            <BiCaretLeft
              className="btn-control small-hidden"
              size={30}
              onClick={Viewer.gotoLeft}
            />
            <BiCaretRight
              className="btn-control small-hidden"
              size={30}
              onClick={Viewer.gotoRight}
            />
            <BiCaretUp
              className="btn-control small-hidden"
              size={30}
              onClick={Viewer.gotoUp}
            />
            <BiCaretDown
              className="btn-control small-hidden"
              size={30}
              onClick={Viewer.gotoDown}
            />
            <BiPlus
              className="btn-control small-hidden"
              size={30}
              onClick={Viewer.zoomIn}
            />
            <BiMinus
              className="btn-control small-hidden"
              size={30}
              onClick={Viewer.zoomOut}
            />
            {!fullscreen ? (
              <BiExpand
                className="btn-control small-hidden"
                size={24}
                onClick={toggleFullscreen}
              />
            ) : (
              <BiCollapse
                className="btn-control small-hidden"
                size={24}
                onClick={toggleFullscreen}
              />
            )}
          </>
        )}
        <BiArrowFromTop
          className="btn-control"
          size={24}
          onClick={toggleControl}
        />
        <BiFastForward
          className="btn-control"
          size={30}
          onClick={Viewer.gotoNextroom}
        />
      </div>
    </>
  );
};

export default ViewerControl;
