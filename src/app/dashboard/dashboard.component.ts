import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

export class Transaction {
  item: string;
  cost: number;
  description: string;
  currency?: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  displayedColumns: string[] = ["item", "cost"];
  transactions: Transaction[] = [
    {
      item: "Demo Agency Solution",
      cost: 0,
      description:
        "This is a complementary Agency Solution Trial valid for 5 days from your purchase."
    },
    {
      item: "Demo Enterprise Solution",
      cost: 500,
      description:
        "This is a scaled up version of the Agency Solution, valid for 15 days from your purchase."
    },
    {
      item: "Demo Fully Managed Solution : Analysis",
      cost: 1500,
      description:
        "We will analyse your requirements and provide you with insights on profits for you business, upon choosing our services. We will also be detailing the most beneficial of your services which woud best serve your requirements, as part of this analysis."
    }
  ];

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions
      .map(t => t.cost)
      .reduce((acc, value) => acc + value, 0);
  }

  navigateToPayment() {
    this.router.navigate(["paymentDetails"]);
  }
}
