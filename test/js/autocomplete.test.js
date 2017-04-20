import store from '../../web/static/js/store';
import { PROBLEM_PLACEHOLDER } from '../../web/static/js/constants';
import { setProblems, focus, blur, match, go, up, down } from '../../web/static/js/actions';

describe('autocomplete', () => {
  const problems = [
    [ "javascript-project", "a javascript project"            ],
    [ "elixir-project",     "an elixir project"               ],
    [ "rails-project",      "a rails project"                 ],
    [ "project-lead",       "a project in need of leadership" ],
    [ "project-rescue",     "a project that just needs help!" ]
  ];

  beforeEach(() => {
    setProblems(problems);
  });

  it("should set active to the range of options indexes on reset", () => {
    const { autocomplete } = store.getState();
    // already reset in beforeEach
    expect(autocomplete.active[0]).toBe(0);
    expect(autocomplete.active[1]).toBe(1);
    expect(autocomplete.active[2]).toBe(2);
    expect(autocomplete.active[3]).toBe(3);
    expect(autocomplete.active[4]).toBe(4);
  });

  it("should update the list of inactive indexes", () => {
    match("jav");
    const { autocomplete } = store.getState();
    expect(autocomplete.active.length).toBe(1);
  });

  it("should collapse spaces", () => {
    match("a jav ");
    const { autocomplete } = store.getState();
    expect(autocomplete.active.length).toBe(1);
  });

  it("should go", () => {
    match("jav"); // only one problem matches
    go();

    expect(store.getState().input.url).toBe("javascript-project");

    match("");
    go();
    expect(store.getState().input.url).toBe(undefined);

    up();
    go();
    expect(store.getState().input.url).toBe("javascript-project");
  });
});
