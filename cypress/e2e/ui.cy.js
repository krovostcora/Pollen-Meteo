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
                cy.get(".radio-input[value='line']").should("exist");
                cy.get(".radio-input[value='bar']").should("exist");
            });
        });


        it("allows selecting line graph", () => {
            cy.get(".radio-input[value='line']").check({ force: true }).should("be.checked");
            cy.get(".radio-input[value='bar']").should("not.be.checked");
        });

        it("allows selecting bar chart", () => {
            cy.get(".radio-input[value='bar']").check({ force: true }).should("be.checked");
            cy.get(".radio-input[value='line']").should("not.be.checked");
        });

        it("updates selectedGraph state correctly", () => {
            // перевірка через checked
            cy.get(".radio-input[value='line']").check({ force: true }).should("be.checked");
            cy.get(".radio-input[value='bar']").check({ force: true }).should("be.checked");
        });
    });


    it("can toggle dark mode", () => {
        // перевірка початкового стану
        cy.get("body").should("not.have.class", "dark");
        // клік по checkbox
        cy.get(".theme-toggle-checkbox").check({ force: true });
        cy.get("body").should("have.class", "dark");
        // вимикаємо назад
        cy.get(".theme-toggle-checkbox").uncheck({ force: true });
        cy.get("body").should("not.have.class", "dark");
    });

    it("can switch language", () => {
        cy.get("select.language-switcher").select("uk");
        cy.contains(/Алергени|Пилок|Метео/);
        cy.get("select.language-switcher").select("en");
        cy.contains(/Pollen|Meteo/);
    });

    it("renders main chart or data view", () => {
        cy.get(".panel-wrapper").should("exist");
        cy.get(".panel-wrapper").find("canvas, svg").should("exist");
    });

    it("shows footer with current year", () => {
        const year = new Date().getFullYear();
        cy.get("footer").should("contain.text", `Pollen&Meteo © ${year}`);
    });
});
