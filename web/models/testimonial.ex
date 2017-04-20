defmodule PFA.Testimonial do
  use PFA.Web, :model

  schema "testimonials" do
    field :text, :string
    field :person, :string
    field :company, :string
    field :url, :string

    timestamps()
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
