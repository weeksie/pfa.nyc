defmodule PFA.TestimonialTest do
  use PFA.ModelCase

  alias PFA.Testimonial

  @valid_attrs %{company: "some content", person: "some content", text: "some content", url: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Testimonial.changeset(%Testimonial{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Testimonial.changeset(%Testimonial{}, @invalid_attrs)
    refute changeset.valid?
  end
end
