defmodule PFA.Testimonial do
  use PFA.Web, :model

  alias PFA.Testimonial
  alias PFA.Repo

  schema "testimonials" do
    field :text, :string
    field :person, :string
    field :company, :string
    field :url, :string

    timestamps()
  end

  @doc """
  Grabs a random testimonial from the datababase.
  """
  def random() do
    # If there are ever enough testimonials in the db to make this
    # hit performance I'll use a real query. Stop looking at me.
    Enum.random Repo.all(Testimonial)
  end

  @doc """
  Grabs a randomized list of testimonials from the datababase.
  """
  def shuffle() do
    # see above
    Enum.shuffle Repo.all(Testimonial)
  end


  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:text, :person, :company, :url])
    |> validate_required([:text, :person, :company, :url])
  end
end
