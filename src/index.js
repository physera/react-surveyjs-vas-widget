import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
    const { rating: initialRating } = this.props
    this.state = {
      rating: this.parseInitialRating(initialRating)
    };
  }

  parseInitialRating = (initialRating) => {
    if (typeof initialRating === "number") {
      return this.translateRating(initialRating)
    } else if (typeof initialRating === "string") {
      try {
        parseFloat(initialRating)
      } catch (error) {
        console.warn(`Error parsing initial VAS rating ${initialRating}`)
        return 0.0
      }
    }
    return 0.0
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

    const head = _.head(sanitizedRateValues);
    const tail = _.last(sanitizedRateValues);
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
    const {
      min,
      max,
      minRateDescription,
      maxRateDescription,
    } = this.props;
    const start = 0;
    const end = 1;
    const step = (end - start) / (max - min);
    const ratingValues = _.map(_.range(start, end + step, step), r => Number(r.toFixed(1)));
    const source = _.map(ratingValues, value =>
      ({ value: value, label: this.translatePosition(value).toString() }),
    );
    _.head(source).text = minRateDescription;
    _.last(source).text = maxRateDescription;
    return source;
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
