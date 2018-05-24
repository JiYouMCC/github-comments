describe("Github comments test", function() {
    var owner = "JiYouMCC";
    var repos = "github-comments";
    var clientId = "ca1f2f2f0b71983065c5";
    var clientSecret = "48f6a24d710cc1012011fce5824f89a26fc49970";

    beforeEach(function() {
        GithubComments.Init(owner, repos, clientId, clientSecret);
    });

    it("The owner, repos client id, client secret should be set after init", function() {
        expect(GithubComments._repos).toBe(repos);
        expect(GithubComments._owner).toBe(owner);
        expect(GithubComments._clientId).toBe(clientId);
        expect(GithubComments._clientSecret).toBe(clientSecret);
    });
});
