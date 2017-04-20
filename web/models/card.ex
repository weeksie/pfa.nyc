defmodule PFA.Card do
  use PFA.Web, :model

  schema "cards" do
    field :name, :string
    field :url, :string
    field :description, :string


    many_to_many :projects,     PFA.Project, join_through: "card_projects"
    many_to_many :blog_posts,   PFA.BlogPost, join_through: "card_blog_posts"
    many_to_many :testimonials, PFA.Testimonial, join_through: "card_testimonials"

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:url, :name, :description])
    |> validate_required([:url, :name, :description])
  end
end
