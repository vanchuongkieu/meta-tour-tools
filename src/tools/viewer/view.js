import utils from '@/utils';
import PropTypes from 'prop-types';
import Handler from './handler';

let $this;
let panoViewer;
class Viewer extends Handler {
  constructor(props) {
    super(props);
    $this = this;
    this.state = {
      isLoading: true,
      panoramas: this.panoramas(props),
    };
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    draggable: PropTypes.bool,
    onMouseWheel: PropTypes.func,
    onMouseMove: PropTypes.func,
    onError: PropTypes.func,
  };

  static defaultProps = {
    draggable: false,
  };

  componentDidMount() {
    panoViewer = this.initializeRoom();
    panoViewer.on('error', (message) => this.onError(message));
    panoViewer.on('mousewheel', (hfov) => this.onMouseWheel(hfov));
    panoViewer.on('mousemove', (coords) => this.onMouseMove(coords));
    panoViewer.on('loadroom', (idRoom) => this.onLoadRoom(idRoom));
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

  componentDidUpdate() {}

  componentWillUnmount() {
    panoViewer.off('load');
    panoViewer.off('error');
    panoViewer.off('loadroom');
    panoViewer.off('mousemove');
    panoViewer.off('mousewheel');
  }

  static loadRoom(idRoom, targetPitch, targetYaw, targetHfov) {
    $this.setState({isLoading: true});
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

  static startOrientation() {
    if (!utils.isMobileOrIOS) startOrientation();
  }

  static stopOrientation() {
    stopOrientation();
  }

  static gotoNextroom() {
    const current = panoViewer.getScene();
    const allScene = panoViewer.getScenes();
    const objectKeys = Object.keys(allScene);
    objectKeys.forEach((scene, index) => {
      if (current === scene) {
        if (index + 1 < objectKeys.length) {
          Viewer.loadRoom(objectKeys[index + 1]);
        } else {
          Viewer.loadRoom(objectKeys[0]);
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
          Viewer.loadRoom(objectKeys[index - 1]);
        } else {
          Viewer.loadRoom(objectKeys[objectKeys.length - 1]);
        }
      }
    });
  }

  render() {
    const {isLoading} = this.state;
    return (
      <div className="panorama_wrapper">
        <div id="panorama_view"></div>
        <Loading loading={isLoading} />
        <img id="panorama_background" />
      </div>
    );
  }
}

const Loading = ({loading}) => {
  return (
    <i
      id="loading_pano"
      style={{opacity: Number(loading), display: loading ? 'block' : 'none'}}>
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
            <stop stopColor="#fff" stopOpacity="0" offset="0%"></stop>
            <stop stopColor="#fff" stopOpacity=".631" offset="63.146%"></stop>
            <stop stopColor="#fff" offset="100%"></stop>
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)">
            <path
              d="M36 18c0-9.94-8.06-18-18-18"
              id="Oval-2"
              stroke="url(#a)"
              strokeWidth="2">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"></animateTransform>
            </path>
            <circle fill="#fff" cx="36" cy="18" r="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.5s"
                repeatCount="indefinite"></animateTransform>
            </circle>
          </g>
        </g>
      </svg>
    </i>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool,
};

Loading.defaultProps = {
  loading: true,
};

Viewer.Room = () => {};
Viewer.Compass = function compass() {
  return (
    <div
      id="compass_icon"
      className="small-element controls_btn compass_control">
      <i className="icon-compass"></i>
    </div>
  );
};

export default Viewer;
