import React from "react";
import Draggable from 'react-draggable';
import { SketchPicker } from 'react-color';
import { Resizable } from 'react-resizable';





class BackgroundColor extends React.Component {

    propTypes: {
        onChange:   React.PropTypes.func,
        popupOpen: React.PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: this.props.popupOpen,
            displayColor: this.props.primaryColor
        }
    }

    handleChangeComplete = (color) => {
        
        // Update our internal color state
        if (color.hsl !== this.state.displayColor) {
            this.setState({
                displayColor: color.hsl
            });
        }

        if (typeof this.props.onChange === 'function') {
            // Pass up whether or not the color picker was opened so that
            // the parent can decide whether or not to display with the popup
            // on redraw
            this.props.onChange(color, this.props.displayColorPicker);
            console.log("Emitted color change event to parent");
        }
    };


    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    render() {
        var boxSize = {
            width: "245px",
            height: "330px"
        }
        return (
                <Draggable bounds="#content" >
                    <Resizable width={200} height={200} 
                    minConstraints={[100, 100]} maxConstraints={[300, 300]}>
                        <div className="box" style={boxSize}>
                            <div>
                                <SketchPicker color={this.state.displayColor} onChangeComplete={ this.handleChangeComplete }/>
                            </div>
                        </div>
                    </Resizable>
                </Draggable>
        );
    }
}

export default BackgroundColor;
