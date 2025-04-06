import PropTypes from "prop-types";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

function Chart({ type, title, data, max, min, yAxisTitle }) {
    const options = {
        chart: {
            type: type,
            height: "65%",
            legend: {
                enabled: false,
            },
        },
        title: {
            text: title,
            align: "left",
        },
        xAxis: {
            title: {
                text: "Номер замера",
            },
            tickInterval: 1, // Ensure the x-axis shows integers
            min: 1, // Start from 1
            max: data.length, // End at the length of the data
        },
        yAxis: {
            title: {
                text: yAxisTitle,
            },
            max: max + 1,
            min: min - 1,
            plotLines: [
                {
                    color: "red",
                    value: max,
                    width: 2,
                    zIndex: 5,
                    label: {
                        text: "Максимальное значение",
                        align: "left",
                        style: {
                            color: "red",
                        },
                    },
                },
                {
                    color: "red",
                    value: min,
                    width: 2,
                    zIndex: 5,
                    label: {
                        text: "Минимальное значение",
                        align: "left",
                        style: {
                            color: "red",
                        },
                    },
                },
            ],
        },
        series: [
            {
                data: data.map((point) => point.y),
            },
        ],
        tooltip: {
            formatter: function () {
                const dateTime = data[this.point.index].dateTime; // Access the date/time from the data
                return `<b>Замер ${this.x}</b><br/>${yAxisTitle}: ${this.y}<br/>Дата/Время: ${dateTime}`;
            },
        },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
}

Chart.propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    yAxisTitle: PropTypes.string,
};

export default Chart;
