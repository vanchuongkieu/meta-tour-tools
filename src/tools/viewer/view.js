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
      </div>
    );
  }
}

Viewer.Room = () => {};

export default Viewer;
