describe("Test project features", () => {
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

    it("should display the Create project", () => {
        cy.get(".MuiListItem-root") 
        .find('[data-testid="AddBoxOutlinedIcon"]')
        .click();
      
        cy.get(".MuiDialog-root").should("contain", "Create Project"); 
    });

    it("Entering values then clicking apply should create project", () => {
        cy.get(".MuiListItem-root")
          .find('[data-testid="AddBoxOutlinedIcon"]')
          .click();
      
        // Enter values in the input fields
        cy.get('input[name="projectName"]').type("Test Project");
        cy.get('input[name="projectDescription"]').type("Test Description");
      
        // Click the "Apply" button
        cy.get(".MuiDialogActions-root").contains("Apply").click();
      
        // Add assertions to verify that the project is created
        cy.get(".MuiPaper-root").should("contain", "Test Project");
      });
});