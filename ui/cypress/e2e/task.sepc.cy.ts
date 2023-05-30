describe("Test task features", () => {
    beforeEach(() => {
        cy.setCookie("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlciI6Imdvb2dsZSIsImlkIjoiZjRjN2VlY2EtNjMzNC00OTI1LTk1NmItMmI4MmZkMGRmODA4IiwiZW1haWwiOiJ5dWV0Y2hldWtjaGFuQGdtYWlsLmNvbSIsIm5hbWUiOiJ1c2VyODY1MzczMzkwIiwiaWF0IjoxNjg1MTM3OTUyLCJleHAiOjE2ODU3NDI3NTJ9.icegLXV0o02ILiUzK3eR1RFcM4GBGO_qF-3p8ZagGo4", {
            domain: "localhost",
            path: "/",
            expiry: Date.now() + 86400000, 
            httpOnly: false, 
            secure: false 
          });

        cy.visit("http://localhost:3000");
    });

    it("should display the Create Kanban Card", () => {
        cy.get(".MuiFab-root") 
        .find("[data-testid='AddIcon']")
        .click();

        cy.get(".MuiDialog-root").should("contain", "Create Kanban Card"); 
    });

    it("Entering values then clicking apply should create kanban card", () => {
        cy.get(".MuiFab-root") 
        .find("[data-testid='AddIcon']")
        .click();

        const titleTextfield = cy.get(".MuiTextField-root") 
        .contains("label", "Title") 
        .parent("div")
        .find("input");

        titleTextfield.type("Test title").trigger("change");

        const tagsTextfield = cy.get(".MuiTextField-root") 
        .contains("label", "Enter tags") 
        .parent("div")
        .find("input");

        tagsTextfield.type("Test tag");
        tagsTextfield.type("{enter}");

        const subtasksTextfield = cy.get(".MuiTextField-root") 
        .contains("label", "Enter subtasks") 
        .parent("div")
        .find("input");
        
        subtasksTextfield.type("Test subtask");
        subtasksTextfield.type("{enter}");

        const descriptionTextarea = cy.get('textarea[placeholder="Enter the description"]');

        descriptionTextarea.type("Test description");

        const noteTextarea = cy.get('textarea[placeholder="Enter the note"]');
        
        noteTextarea.type("Test note");

        const assigneeSelect = cy.get(".MuiFormControl-root")
        .contains("label", "Assignee")
        .parent("div")

        assigneeSelect.click() 

        cy.contains("li", "yuetcheukchan@gmai ...").click();
        
        cy.get(".MuiDialogActions-root")
        .contains("button", "Apply")
        .click();

        cy.get(".MuiPaper-root").should("be.visible");

        cy.contains(".MuiPaper-root", "Test title")
        .parent("div")
        .siblings() 
        .contains("Backlog")
        .should("be.visible");

        cy.contains(".MuiFormGroup-root", "Test subtask")
        .should("be.visible");

        cy.contains(".MuiFormGroup-root", "Test subtask")
        .get("input[type='checkbox']")
        .should("exist");

        cy.contains(".MuiPaper-root", "Test tag")
        .should("be.visible");

        // Clean up the kanban card
        cy.get(".MuiPaper-root")
        .first()
        .click();
        
        cy.get(".MuiTypography-root")
        .contains("button", "Delete")
        .click()
    });
});