import utils from '@/utils';
import PropTypes from 'prop-types';
import Loading from './components/Loading';
import {
  FaCompress,
  FaExpand,
  FaRegCircle,
  FaRegDotCircle,
} from 'react-icons/fa';
import pannellum from '../libraries/pannellum';
import {PureComponent} from 'react';

let $viewer;
let panoViewer;
class Viewer extends PureComponent {
  constructor(props) {
    super(props);
    $viewer = this;
    this.state = {
      isLoading: true,
      fullscreen: false,
      isOrientation: false,
      isOrientationSupport: false,
      panoramas: this.panoramas(props),
    };
    this.handleFullscreen = this.handleFullscreen.bind(this);
    this.toggleOrientation = this.toggleOrientation.bind(this);
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    draggable: PropTypes.bool,
    onMouseWheel: PropTypes.func,
    onMouseMove: PropTypes.func,
    onDraggable: PropTypes.func,
    onLoadRoom: PropTypes.func,
    onError: PropTypes.func,
  };

  static defaultProps = {
    draggable: false,
  };

  panoramas({children, draggable}) {
    const rooms = Array.isArray(children) ? [...children] : [children];
    const mappingRoom = rooms.map((c) => {
      const room = {...c.props};
      room.panorama = room.panoramaImage;
      room.friction = room.friction || 0.15;
      room.hotSpots = room.markers.map((marker) => {
        if (draggable) {
          marker.draggable = draggable;
        }
        switch (marker.object) {
          case 'marker':
            let eventHandling = {};
            let tooltip = marker.tooltipText;
            if (marker.tooltip_type == 'room_name') {
              tooltip = marker.nameRoomTarget;
            }
            if (marker.draggable) {
              eventHandling = {
                dragHandlerFunc: this.draggable,
                dragHandlerArgs: marker,
              };
            } else {
              eventHandling = {
                clickHandlerFunc: this.goto,
                clickHandlerArgs: [
                  marker.idRoomTarget,
                  parseInt(marker.pitch),
                  parseInt(marker.yaw),
                  marker.transitionZoom,
                  marker.timeAnimated,
                  marker.lookAt,
                ],
              };
            }
            return {
              id: marker.id,
              text: tooltip,
              cssClass: 'custom-hotspot',
              createTooltipFunc: this.hotspot,
              createTooltipArgs: marker,
              pitch: marker.pitch,
              yaw: marker.yaw,
              icon: marker.icon,
              type: marker.type,
              draggable: marker.draggable,
              animation: marker.animation,
              transform3d: marker.transform3d,
              rotateX: marker.rotateX,
              rotateZ: marker.rotateZ,
              scale: marker.scale,
              sizeScale: marker.sizeScale || 1,
              object: marker.object,
              idRoomTarget: marker.idRoomTarget,
              nameRoomTarget: marker.nameRoomTarget,
              ...eventHandling,
            };
        }
      });
      delete room.markers;
      delete room.panoramaImage;
      if (room.type == 'image') {
        room.type = 'equirectangular';
      }
      return room;
    });

    return mappingRoom.reduce((accumulated, current) => {
      return {
        ...accumulated,
        [current.id]: current,
      };
    }, {});
  }

  initializeRoom() {
    try {
      panoViewer.destroy();
      panoViewer = null;
    } catch (error) {}
    panoViewer = pannellum.viewer('panorama_view', {
      autoLoad: true,
      firstScene: 'scene1',
      showZoomCtrl: false,
      showFullscreenCtrl: false,
      scenes: this.state.panoramas,
    });
    panoViewer.on('load', () => {
      if (utils.isMobileOrIOS) {
        panoViewer.setFriction(0.4);
      }
      setTimeout(() => {
        this.setState({isLoading: false});
      }, 50);
    });
    return panoViewer;
  }

  goto(_, [idRoom, pitch, yaw, zoom, animated, lookAt]) {
    lookAt = lookAt === undefined ? 0 : Number(lookAt);
    let lookAtPitch = pitch;
    let lookAtYaw = yaw;
    if (lookAt == 0) {
      lookAtYaw = panoViewer.getYaw();
      lookAtPitch = panoViewer.getPitch();
    }
    $viewer.setState({isLoading: true});
    const lookAtZoom = panoViewer.getHfov() - zoom;
    panoViewer.lookAt(lookAtPitch, lookAtYaw, lookAtZoom, animated, () => {
      const next = $viewer.state.panoramas[idRoom];
      panoViewer.loadScene(idRoom, next.pitch, next.yaw, next.hfov);
    });
  }

  draggable(_, marker) {
    if (!$viewer.props.onDraggable) return;
    $viewer.props.onDraggable(marker);
  }

  hotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip');
    hotSpotDiv.classList.add('noselect');
    hotSpotDiv.classList.add('marker_' + args.id);
    hotSpotDiv.addEventListener('mouseover', function (e) {
      if (!utils.isMobileOrIOS) {
        document.getElementById('tooltip_marker_' + args.id).style.opacity = 1;
      }
    });
    hotSpotDiv.addEventListener('mouseenter', function (e) {
      if (!utils.isMobileOrIOS) {
        document.getElementById('tooltip_marker_' + args.id).style.opacity = 1;
      }
    });
    hotSpotDiv.addEventListener('mouseleave', function (e) {
      if (!utils.isMobileOrIOS) {
        document.getElementById('tooltip_marker_' + args.id).style.opacity = 0;
      }
    });
    hotSpotDiv.addEventListener('mouseup', function (e) {
      if (!utils.isMobileOrIOS) {
        document.getElementById('tooltip_marker_' + args.id).style.opacity = 0;
      }
    });

    switch (args.tooltipType) {
      case 'text':
        if (args.tooltipText && args.tooltipText !== '') {
          const tooltip = document.createElement('div');
          tooltip.setAttribute('id', 'tooltip_marker_' + args.id);
          tooltip.classList.add('tooltip_marker_' + args.id);
          tooltip.classList.add('tooltip_text');
          tooltip.innerHTML = args.tooltipText.toUpperCase();
          hotSpotDiv.parentNode.appendChild(tooltip);
        }
        break;
      case 'room_name':
        const tooltip = document.createElement('div');
        tooltip.setAttribute('id', 'tooltip_marker_' + args.id);
        tooltip.classList.add('tooltip_marker_' + args.id);
        tooltip.classList.add('tooltip_text');
        tooltip.innerHTML = args.nameRoomTarget.toUpperCase();
        hotSpotDiv.parentNode.appendChild(tooltip);
        break;
    }

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('div_marker_wrapper');
    divWrapper.style.background = args.background;
    divWrapper.style.color = args.color;
    hotSpotDiv.appendChild(divWrapper);
  }

  componentDidMount() {
    panoViewer = this.initializeRoom();
    panoViewer.on('error', (message) => this.onError(message));
    panoViewer.on('mousewheel', (hfov) => this.onMouseWheel(hfov));
    panoViewer.on('mousemove', (coords) => this.onMouseMove(coords));
    panoViewer.on('loadroom', (idRoom) => this.onLoadRoom(idRoom));
    this.setState({isOrientationSupport: utils.isMobileOrIOS});
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    panoViewer.off('load');
    panoViewer.off('error');
    panoViewer.off('loadroom');
    panoViewer.off('mousemove');
    panoViewer.off('mousewheel');
  }

  onMouseWheel(hfov) {
    if (!this.props.onMouseWheel) return;
    this.props.onMouseWheel(hfov);
  }

  onMouseMove(coords) {
    if (!this.props.onMouseMove) return;
    this.props.onMouseMove(coords);
  }

  onLoadRoom(idRoom) {
    this.setState({isLoading: false});
    if (!this.props.onLoadRoom) return;
    this.props.onLoadRoom(idRoom);
  }

  onError(message) {
    if (!this.props.onError) return;
    this.props.onError(message);
  }

  handleFullscreen() {
    this.setState((prev) => ({
      fullscreen: !prev.fullscreen,
    }));
    panoViewer.toggleFullscreen();
  }

  static loadRoom(idRoom, targetPitch, targetYaw, targetHfov) {
    $viewer.setState({isLoading: true});
    const pitch = panoViewer.getPitch();
    const hfov = panoViewer.getHfov();
    const yaw = panoViewer.getYaw();
    panoViewer.lookAt(pitch, yaw, hfov - 0.5, 500, () => {
      panoViewer.loadScene(idRoom, targetPitch, targetYaw, targetHfov);
    });
  }

  static setPitch(pitch) {
    panoViewer.setPitch(pitch);
  }

  static setPitchBounds(bounds) {
    panoViewer.setPitchBounds(bounds);
  }

  static setYaw(yaw) {
    panoViewer.setYaw(yaw);
  }

  static setYawBounds(bounds) {
    panoViewer.setYawBounds(bounds);
  }

  toggleOrientation() {
    if (!utils.isMobileOrIOS) {
      this.setState((prev) => ({
        isOrientation: prev.isOrientation,
      }));
      if (!this.state.isOrientation) {
        panoViewer.startOrientation();
        return;
      }
      panoViewer.stopOrientation();
    }
  }

  static gotoNextroom() {
    const current = panoViewer.getScene();
    const allScene = panoViewer.getScenes();
    const objectKeys = Object.keys(allScene);
    objectKeys.forEach((scene, index) => {
      if (current === scene) {
        if (index + 1 < objectKeys.length) {
          $viewer.loadRoom(objectKeys[index + 1]);
        } else {
          $viewer.loadRoom(objectKeys[0]);
        }
      }
    });
  }

  static gotoPrevroom() {
    const current = panoViewer.getScene();
    const allScene = panoViewer.getScenes();
    const objectKeys = Object.keys(allScene);
    objectKeys.forEach((scene, index) => {
      if (current === scene) {
        if (index - 1 >= 0) {
          $viewer.loadRoom(objectKeys[index - 1]);
        } else {
          $viewer.loadRoom(objectKeys[objectKeys.length - 1]);
        }
      }
    });
  }

  render() {
    const {isLoading, fullscreen, isOrientation, isOrientationSupport} =
      this.state;
    return (
      <div className="panorama_wrapper">
        <div className="left-top-controls">
          {isOrientationSupport && (
            <div className="controls_btn" onClick={this.toggleOrientation}>
              {!isOrientation ? <FaRegCircle /> : <FaRegDotCircle />}
            </div>
          )}
        </div>
        <div className="right-top-controls">
          <div className="controls_btn" onClick={this.handleFullscreen}>
            {!fullscreen ? <FaExpand /> : <FaCompress />}
          </div>
        </div>
        <div id="panorama_view"></div>
        <Loading loading={isLoading} />
        <img id="panorama_background" />
        <div className="bottom-controls">
          <div id="compass_icon" className="controls_btn compass">
            <i className="icon-compass"></i>
          </div>
        </div>
      </div>
    );
  }
}

Viewer.Room = () => {};

export default Viewer;
