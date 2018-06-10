import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-toolbox/lib/slider';
import styles from './VASSlider.css';


export default class VASSlider extends React.Component {
  static propTypes = {
    maxRateDescription: PropTypes.string.isRequired,
    minRateDescription: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    theme: PropTypes.shape({}),
    onRatingChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    min: 0,
    max: 10,
    step: 0.0001,
    theme: styles,
  }

  constructor(props) {
    super(props);
    this.state = {
      rating: this.props.rating || 0,
    };
  }
  onChange = (rating) => {
    this.setState({ rating }, this.props.onRatingChange(rating));
  }

  render() {
    const { min, max, step, minRateDescription, maxRateDescription, theme } = this.props;
    const { rating } = this.state;

    return (
      <div>
        <div className={styles.vasRatingContainer}>
          <div className={styles.start}>{minRateDescription}</div>
          <div className={styles.main} />
          <div className={styles.end}>{maxRateDescription}</div>
        </div>
        <div className={styles.vasRatingContainer}>
          <div className={styles.main}>
            <Slider
              min={min}
              max={max}
              step={step}
              value={rating}
              onChange={this.onChange}
              theme={theme}
            />
          </div>
        </div>
      </div>
    );
  }
}
