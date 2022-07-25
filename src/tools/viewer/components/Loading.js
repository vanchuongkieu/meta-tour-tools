import PropTypes from 'prop-types';

const Loading = ({loading}) => {
  return (
    <i
      id="loading_pano"
      style={{opacity: Number(loading), display: loading ? 'block' : 'none'}}>
      <svg
        version="1.1"
        id="L7"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 100 100"
        xmlSpace="preserve">
        <path
          fill="#fff"
          d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="0.7s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
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

export default Loading;
