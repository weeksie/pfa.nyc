defmodule PFA.BlogPostTest do
  use PFA.ModelCase

  alias PFA.BlogPost

  @valid_attrs %{title: "some content", url: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = BlogPost.changeset(%BlogPost{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = BlogPost.changeset(%BlogPost{}, @invalid_attrs)
    refute changeset.valid?
  end
end
