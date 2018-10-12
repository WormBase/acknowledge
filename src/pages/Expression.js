import React from 'react';
import Button from "react-bootstrap/es/Button";
import {
    Checkbox, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, HelpBlock, Image, OverlayTrigger,
    Panel, Tooltip
} from "react-bootstrap";
import AlertDismissable from "../main_layout/AlertDismissable";

class Expression extends React.Component {
    constructor(props, context) {
        super(props, context);
        let alertTitleNotSaved = "";
        let alertTitleSaved = "Well done!";
        let alertTitle = alertTitleNotSaved;
        if (props["saved"]) {
            alertTitle = alertTitleSaved;
        }
        let alertTextNotSaved = "Here you can find expression data that have been identified in your paper. Please " +
            "select/deselect the appropriate checkboxes and add any additional information.";
        let alertTextSaved = "The data for this page has been saved, you can modify it any time.";
        let alertText = alertTextNotSaved;
        if (props["saved"]) {
            alertText = alertTextSaved;
        }
        let alertBsStyleNotSaved = "info";
        let alertBsStyleSaved = "success";
        let alertBsStyle = alertBsStyleNotSaved;
        if (props["saved"]) {
            alertBsStyle = alertBsStyleSaved;
        }
        this.state = {
            value: '',
            active: false,
            cb_anatomic: props["anatomicExpr"],
            cb_anatomic_details: props["anatomicExprDetails"],
            cb_site: props["siteAction"],
            cb_site_details: props["siteActionDetails"],
            cb_time: props["timeAction"],
            cb_time_details: props["timeActionDetails"],
            cb_rna: props["rnaSeq"],
            cb_rna_details: props["rnaSeqDetails"],
            additionalExpr: props["additionalExpr"],
            alertText: alertText,
            alertTitle: alertTitle,
            alertBsStyle: alertBsStyle,
            alertTextNotSaved: alertTextNotSaved,
            alertTextSaved: alertTextSaved,
            alertTitleNotSaved: alertTitleNotSaved,
            alertTitleSaved: alertTitleSaved,
            alertBsStyleNotSaved: alertBsStyleNotSaved,
            alertBsStyleSaved: alertBsStyleSaved
        };

        this.check_cb = props["checkCb"].bind(this);
        this.toggle_cb = props["toggleCb"].bind(this);
        this.selfStateVarModifiedFunction = this.selfStateVarModifiedFunction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOtherCheckChange = this.handleOtherCheckChange.bind(this);
    }

    selfStateVarModifiedFunction(value, stateVarName) {
        let stateElem = {};
        stateElem[stateVarName] = value;
        this.setState(stateElem);
    }

    getValidationState() {
        if (this.state.active === true) {
            const length = this.state.value.length;
            if (length > 0) {
                return 'success';
            } else {
                return 'error';
            }
        } else {
            return '';
        }
    }

    handleOtherCheckChange(e) {
        this.setState({ active: e.target.checked });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    setSuccessAlertMessage() {
        this.alertDismissable.selfStateVarModifiedFunction(this.state.alertTitleSaved, "title");
        this.alertDismissable.selfStateVarModifiedFunction(this.state.alertTextSaved, "text");
        this.alertDismissable.selfStateVarModifiedFunction(this.state.alertBsStyleSaved, "bsStyle");
    }

    render() {
        const tooltip = (
            <Tooltip id="tooltip">
                go to interaction  section  to flag changes of expression level or localization in mutant background or
                upon treatment.
            </Tooltip>
        );

        const siteTooltip = (
            <Tooltip id="tooltip">
                In what tissue is a specific gene to carry out its
                function? This can be demonstrated by phenotype rescue using a
                tissue-specific exogenous promoter, a tissue-specific knock down of gene
                function or other similar experiments. We encourage authors to refer to
                a specific piece of text from their publication in the text box provided.
            </Tooltip>
        );

        const timeTooltip = (
            <Tooltip id="tooltip">
                At what time is a specific gene to carry out its
                function? This can be demonstrated by phenotype rescue using a
                lifestage-specific exogenous promoter, a temperature-shift experiment
                with a temperature-sensitive allele or other similar experiments. We
                encourage authors to refer to a specific piece of text from their
                publication in the text box provided.
            </Tooltip>
        );
        const svmTooltip = (
            <Tooltip id="tooltip">
                This field is prepopulated by Textpresso Central.
            </Tooltip>
        );
        return (
            <div>
                <AlertDismissable
                    title={this.state.alertTitle}
                    text={this.state.alertText}
                    bsStyle={this.state.alertBsStyle}
                    ref={instance => { this.alertDismissable = instance; }}
                />
                <Panel>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Expression data in the paper</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <Form>
                            <Checkbox checked={this.state.cb_anatomic} onClick={() => this.toggle_cb("cb_anatomic", "anatomicExpr")}>
                                <strong>Anatomic Expression data in WT condition</strong> <OverlayTrigger placement="top"
                                                                                         overlay={tooltip}>
                                <Glyphicon glyph="question-sign"/></OverlayTrigger> <OverlayTrigger placement="top"
                                                                                                    overlay={svmTooltip}>
                                <Image src="tpc_powered.svg" width="80px"/></OverlayTrigger>
                            </Checkbox>
                            <FormControl type="text" placeholder="Add details here"
                                         onClick={() => this.check_cb("cb_anatomic", "anatomicExpr")}
                                         value={this.state.cb_anatomic_details}
                                         onChange={(event) => {
                                             this.selfStateVarModifiedFunction(event.target.value, "cb_anatomic_details");
                                             this.props.stateVarModifiedCallback(event.target.value, "anatomicExprDetails");
                                         }}
                            />
                            <Checkbox checked={this.state.cb_site} onClick={() => this.toggle_cb("cb_site", "siteAction")}>
                                <strong>Site of action data</strong> <OverlayTrigger placement="top"
                                                                                     overlay={siteTooltip}>
                                <Glyphicon glyph="question-sign"/></OverlayTrigger>
                            </Checkbox>
                            <FormControl type="text" placeholder="Add details here"
                                         onClick={() => this.check_cb("cb_site", "siteAction")}
                                         value={this.state.cb_site_details}
                                         onChange={(event) => {
                                             this.props.stateVarModifiedCallback(event.target.value, "siteActionDetails");
                                             this.selfStateVarModifiedFunction(event.target.value, "cb_site_details");
                                         }}
                            />
                            <Checkbox checked={this.state.cb_time} onClick={() => this.toggle_cb("cb_time", "timeAction")}>
                                <strong>Time of action data</strong> <OverlayTrigger placement="top"
                                                                                     overlay={timeTooltip}>
                                <Glyphicon glyph="question-sign"/></OverlayTrigger>
                            </Checkbox>
                            <FormControl type="text" placeholder="Add details here"
                                         onClick={() => this.check_cb("cb_time", "timeAction")}
                                         value={this.state.cb_time_details}
                                         onChange={(event) => {
                                             this.props.stateVarModifiedCallback(event.target.value, "timeActionDetails");
                                             this.selfStateVarModifiedFunction(event.target.value, "cb_time_details");
                                         }}
                            />
                            <Checkbox checked={this.state.cb_rna} onClick={() => this.toggle_cb("cb_rna", "rnaSeq")}>
                                <strong>RNAseq data</strong>
                            </Checkbox>
                            <FormControl type="text" placeholder="Add details here"
                                         onClick={() => this.check_cb("cb_rna", "rnaSeq")}
                                         value={this.state.cb_rna_details}
                                         onChange={(event) => {
                                             this.props.stateVarModifiedCallback(event.target.value, "rnaSeqDetails");
                                             this.selfStateVarModifiedFunction(event.target.value, "cb_rna_details");
                                         }}
                            />
                        </Form>
                    </Panel.Body>
                </Panel>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Microarrays</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <p>
                            WormBase regularly imports microarray data from Gene Expression Omnibus. Please submit your
                            microarray data to <a href="https://www.ncbi.nlm.nih.gov/geo/info/submission.html"
                                                  target={"_blank"}>GEO</a>
                        </p>
                    </Panel.Body>
                </Panel>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Add additional type of expression data &nbsp;
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <Form horizontal>
                            <FormGroup
                                controlId="formBasicText"
                                validationState={this.getValidationState()}>
                                <Col componentClass={ControlLabel} sm={7}>
                                    <FormControl
                                        type="text"
                                        value={this.state.additionalExpr}
                                        placeholder="Add details here (e.g., qPCR, Proteomics)"
                                        onChange={(event) => {
                                            this.props.stateVarModifiedCallback(event.target.value, "additionalExpr");
                                            this.selfStateVarModifiedFunction(event.target.value, "additionalExpr");
                                        }}
                                    />
                                    <FormControl.Feedback />
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel.Body>
                </Panel>
                <div align="right">
                    <Button bsStyle="success" onClick={this.props.callback.bind(this, "expression")}>Save and continue
                    </Button>
                </div>
            </div>
        );
    }
}

export default Expression;