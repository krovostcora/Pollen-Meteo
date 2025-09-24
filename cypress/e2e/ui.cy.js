import React from "react";
import WeatherParametersCheckboxes from "../../src/components/parameters/MeteorologicalConditionsSelector.js";

// common selectors
const selectors = {
    graph: {
        line: ".radio-input[value='line']",
        bar: ".radio-input[value='bar']",
    },
    themeToggle: ".theme-toggle-checkbox",
    languageSwitcher: "select.language-switcher",
    panelWrapper: ".panel-wrapper",
    footer: "footer",
};

describe("Pollen-Meteo UI", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("shows logo with Pollen & Meteo", () => {
        cy.contains(/Pollen\s*&\s*Meteo/);
    });

    describe("GraphTypeSelector Component", () => {
        beforeEach(() => {
            cy.visit("/");
        });

        it("renders all graph types", () => {
            cy.get(".block-1").within(() => {
                cy.get(selectors.graph.line).should("exist");
                cy.get(selectors.graph.bar).should("exist");
            });
        });

        it("allows selecting line graph", () => {
            cy.get(selectors.graph.line).check({ force: true }).should("be.checked");
            cy.get(selectors.graph.bar).should("not.be.checked");
        });

        it("allows selecting bar chart", () => {
            cy.get(selectors.graph.bar).check({ force: true }).should("be.checked");
            cy.get(selectors.graph.line).should("not.be.checked");
        });

        it("updates selectedGraph state correctly", () => {
            cy.get(selectors.graph.line).check({ force: true }).should("be.checked");
            cy.get(selectors.graph.bar).check({ force: true }).should("be.checked");
        });
    });

    it("can toggle dark mode", () => {
        // initial state should be light
        cy.get("body").should("not.have.class", "dark");

        // enable dark mode
        cy.get(selectors.themeToggle).check({ force: true });
        cy.get("body").should("have.class", "dark");

        // disable dark mode
        cy.get(selectors.themeToggle).uncheck({ force: true });
        cy.get("body").should("not.have.class", "dark");
    });

    it("can switch language", () => {
        cy.get(selectors.languageSwitcher).select("uk");
        cy.contains(/Алергени|Пилок|Метео/);

        cy.get(selectors.languageSwitcher).select("en");
        cy.contains(/Pollen|Meteo/);
    });

    it("renders main chart or data view", () => {
        cy.get(selectors.panelWrapper).should("exist");
        cy.get(selectors.panelWrapper).find("canvas, svg").should("exist");
    });

    it("shows footer with current year", () => {
        const year = new Date().getFullYear();
        cy.get(selectors.footer).should("contain.text", `Pollen&Meteo © ${year}`);
    });
});
