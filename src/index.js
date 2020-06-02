import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-toolbox/lib/dropdown';
import Slider from 'react-toolbox/lib/slider';
import styles from './VASSlider.css';


export default class VASSlider extends React.PureComponent {
  static propTypes = {
    maxRateDescription: PropTypes.string.isRequired,
    minRateDescription: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    theme: PropTypes.shape({}),
    disabled: PropTypes.bool,
    rateValues: PropTypes.array,
    showValue: PropTypes.bool,
    formatValue: PropTypes.func,
    displayAsDropdown: PropTypes.bool,
    onRatingChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    min: 0,
    max: 10,
    step: 0.0001,
    theme: styles,
    disabled: false,
    showValue: false,
    displayAsDropdown: false,
    formatValue: v => v,
  }

  constructor(props) {
    super(props);
    this.state = {
      rating: typeof this.props.rating === "number" ?
        this.translateRating(this.props.rating) :
        0.0,
    };
  }

  onChange = (rating) => {
    this.setState(
      { rating },
      this.props.onRatingChange(this.translatePosition(rating))
    );
  }

  getRateValues = () => {
    const {
      min,
      max,
      minRateDescription,
      maxRateDescription,
      rateValues,
    } = this.props;
    const sanitizedRateValues = !rateValues || rateValues.length < 2 ?
      [{ value: min, text: minRateDescription }, { value: max, text: maxRateDescription }] :
      rateValues;

    const head = sanitizedRateValues[0];
    const tail = sanitizedRateValues[sanitizedRateValues.length - 1];
    return {
      head: {
        text: head.text,
        value: parseFloat(head.value),
      },
      tail: {
        text: tail.text,
        value: parseFloat(tail.value),
      },
    };
  }

  translatePosition = (position) => {
    const { head, tail } = this.getRateValues();
    return (tail.value - head.value) * position + head.value;
  }

  translateRating = (rating) => {
    const { head, tail } = this.getRateValues();
    return (rating - head.value) / (tail.value - head.value);
  }

  dropdownRatingSource = () => {
    const { min, max } = this.props;
    const start = 0;
    const end = 1;
    const step = end / (max - min);
    const len = Math.floor((end - start) / step) + 1;
    const ratingVals = Array(len).fill().map(
        (_, idx) => Number((start + (idx * step)).toFixed(1)),
    );
    return Array.from(ratingVals, rating =>
        ({ value: rating, label: this.translatePosition(rating) }),
    );
  }

  render() {
    const {
      step,
      theme,
      disabled,
      showValue,
      formatValue,
    } = this.props;
    const { rating } = this.state;
    const { head, tail } = this.getRateValues();

    return this.props.displayAsDropdown ? (
      <div className={styles.vasRatingContainer}>
        <Dropdown
          auto
          disabled={disabled}
          onChange={this.onChange}
          source={this.dropdownRatingSource()}
          value={rating}
          theme={theme}
        />
      </div>
    ) : (
      <div>
        <div className={styles.vasRatingContainer}>
          <div className={styles.start}>{head.text}</div>
          <div className={styles.value}>
            {showValue && formatValue(this.translatePosition(rating))}
          </div>
          <div className={styles.end}>{tail.text}</div>
        </div>
        <div className={styles.vasRatingContainer}>
          <div className={styles.main}>
            <Slider
              disabled={disabled}
              min={0}
              max={1}
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
