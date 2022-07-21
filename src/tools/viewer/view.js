import PropTypes from 'prop-types';
import Handler from './handler';

class Viewer extends Handler {
  constructor(props) {
    super(props);
    this.state = {
      panoramas: this.panoramas(props),
    };
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  componentDidMount() {
    this.startWithFirstRoom();
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="panoramas">
        <div id="panorama_view"></div>
        <i id="loading_pano" style={{opacity: 0, display: 'none'}}>
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                x1="8.042%"
                y1="0%"
                x2="65.682%"
                y2="23.865%"
                id="a">
                <stop stopColor="#fff" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#fff"
                  stopOpacity=".631"
                  offset="63.146%"></stop>
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
                    dur="0.9s"
                    repeatCount="indefinite"></animateTransform>
                </circle>
              </g>
            </g>
          </svg>
        </i>
        <img id="panorama_background" />
      </div>
    );
  }
}

Viewer.Room = () => {};

export default Viewer;
